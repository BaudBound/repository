# Contributing Scripts

The official repository is reviewed more strictly than a personal repository. Inclusion does not mean that a script is guaranteed to be harmless.

## Before opening a pull request

1. Create and verify the script in the BaudBound editor.
2. Use a stable project ID and a semantic version.
3. Export the exact `.bbs` package.
4. Put it in `packages/<script-id>/`.
5. Keep the safe script name and version in the filename.
6. Generate the repository entry from the same editor export.
7. Add or replace the matching entry in `repository.json`.
8. Run `pnpm validate`.
9. Explain what the script does, what starts it, and what side effects it can cause.

## Review requirements

A contribution may be rejected when:

1. Its purpose or behavior is unclear.
2. Its metadata is incomplete or misleading.
3. Its package claims do not match the repository entry.
4. Its source or license cannot be reviewed.
5. It requests access that is not justified by its behavior.
6. It contains credentials, personal data, or unsafe bundled assets.
7. It replaces an existing versioned package file.

Reviewers may request changes before accepting a script. Every package still requires local review and approval by each runner operator.

## Updating a script

Never replace a published `.bbs` file. Add a new versioned package in the same script ID directory and update the entry only after the new file is available.

The script ID must remain unchanged. The version must be newer than the published version.

## Removing a script

A script can be removed from the catalog when it is unsafe, misleading, abandoned, legally disputed, or no longer compatible.

Removing a catalog entry does not uninstall copies that users already installed. A security notice should explain urgent removals when users need to take action.

