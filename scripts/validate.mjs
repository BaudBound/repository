import { createHash } from "node:crypto";
import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contractsDirectory = path.resolve(
  process.env.BAUDBOUND_CONTRACTS_DIR ?? path.join(root, "contracts"),
);
const repositoryPath = path.join(root, "repository.json");
const schemaPath = path.join(contractsDirectory, "repository.schema.json");
const rawPrefix =
  "https://raw.githubusercontent.com/BaudBound/repository/main/";

const repositoryExists = await access(repositoryPath)
  .then(() => true)
  .catch(() => false);
if (!repositoryExists) {
  console.log(
    "No repository.json is published yet. The repository scaffold is valid.",
  );
  process.exit(0);
}

const [repositoryBytes, schemaBytes] = await Promise.all([
  readFile(repositoryPath),
  readFile(schemaPath),
]);
const repository = JSON.parse(repositoryBytes.toString("utf8"));
const schema = JSON.parse(schemaBytes.toString("utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);

if (!validate(repository)) {
  const details = ajv.errorsText(validate.errors, {
    dataVar: "repository",
    separator: "\n",
  });
  throw new Error(`repository.json does not match the canonical schema:\n${details}`);
}

for (const script of repository.scripts) {
  const packageUrl = script.latest.package_url;
  if (!packageUrl.startsWith(rawPrefix)) {
    throw new Error(
      `${script.script_id} must use an immutable raw package URL under ${rawPrefix}`,
    );
  }
  const relativePath = decodeURIComponent(packageUrl.slice(rawPrefix.length));
  const expectedPrefix = `packages/${script.script_id}/`;
  if (
    !relativePath.startsWith(expectedPrefix) ||
    relativePath.includes("..") ||
    !relativePath.endsWith(".bbs")
  ) {
    throw new Error(
      `${script.script_id} package URL must point inside ${expectedPrefix}`,
    );
  }

  const packagePath = path.resolve(root, relativePath);
  if (!packagePath.startsWith(path.join(root, "packages") + path.sep)) {
    throw new Error(`${script.script_id} package path leaves the packages directory`);
  }
  const packageInfo = await stat(packagePath);
  if (packageInfo.size !== script.latest.size) {
    throw new Error(
      `${script.script_id} package size is ${packageInfo.size}, expected ${script.latest.size}`,
    );
  }
  const digest = createHash("sha256")
    .update(await readFile(packagePath))
    .digest("hex");
  if (digest !== script.latest.sha256) {
    throw new Error(`${script.script_id} package SHA256 does not match repository.json`);
  }
}

console.log(
  `Validated ${repository.scripts.length} scripts in ${repository.name}.`,
);
