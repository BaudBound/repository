# BaudBound Script Repository

This project hosts the official script catalog used by the BaudBound runner.

The runner reads the raw public file at:

```text
https://raw.githubusercontent.com/BaudBound/repository/master/repository.json
```

Published packages belong under:

```text
packages/<script-id>/<safe-script-name>-<version>.bbs
```

Every package filename is immutable. A new release gets a new versioned file. `repository.json` is updated only after the package is publicly available.

Repository and package downloads are always public and anonymous. Their HTTPS URLs must not contain user information, query strings, fragments, signed-download parameters, or embedded credentials. Files must be directly downloadable without login, cookies, `Authorization`, or proxy-authentication headers, and every redirect must remain public anonymous HTTPS.

The Official label identifies this catalog as maintained by the BaudBound project. It does not bypass package validation, approval, or runner security checks.

## Validation

Install dependencies:

```text
pnpm install
```

Check `repository.json`, every remote URL policy, and every referenced local package:

```text
pnpm validate
```

Validation uses the canonical schema from [BaudBound/contracts](https://github.com/BaudBound/contracts).

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a script. Every contribution must include the exported package, complete repository metadata, a stable script identity, and enough information for reviewers to understand its behavior and required access.
