# Versioning

We use automatic bumps, so no version management is needed. It is important to clarify though that we follow SemVer, so `<Major>.<Minor>.<Patch>`

## Commit Messages To `main`

Commit messages to the `main` branch follow a strict pattern. Failure to conform to these will trigger a CI fail.

```txt
[<Type of Commit>] <Commit Message>
```

And every letter should be capitalized.

✅ Correct Commit Message:

- `[DOCS] Meaningful Commit Message`

❌ Incorrect Commit Messages:

- `[DOCS] Meaningful commit message`
- `[docs] Meaningful Commit Message`
- `Meaningful Commit Message`

## PR Titles

PR titles should follow the same rules as commit messages to the branch they're pushing to, since we will always use the PR title as the commit message when merging a PR.

> **Reason**: GitHub only allows checks on commit messages before pushing them with their Enterprise plan. This allows us to block a merge until the PR name is correct.

## List of Accepted Types of Commit

| Commit Type | Version Bump  | Usage                                            |
| ----------- | ------------- | ------------------------------------------------ |
| `BREAK`     | Major (X.0.0) | Changes that break existing features.            |
| `FEAT`      | Minor (0.X.0) | Changes that implement new features.             |
| `FIX`       | Patch (0.0.X) | Bug fixes, performance fixes.                    |
| `DOCS`      | None          | Changes to docs (including comments)             |
| `STYLE`     | None          | Changes to the formatter(s)                      |
| `REFACTOR`  | None          | Changes to the code that don't change its logic. |
| `TEST`      | None          | Changes relating to the tests                    |
| `CI`        | None          | Changes relating to CI/CD                        |
