# Standards

## PR Titles/Commit Messages

Commit messages to the `main` branch follow a strict pattern

```txt
[<Type of Commit>] <Commit Message>
```

This is because we have CIs to bump the version of the codebase based on the commit metadata.
In addition to this, PR Titles, and by extension Commit Messages to `main` should ALWAYS have every word capitalized. Commit messages for commits to `main` should ALWAYS be the same as the title of its related PR.

## Versioning

As stated previously, we use automatic bumps, so no version management is needed. It is important to clarify though that we follow SemVer, so `<Major>.<Minor>.<Patch>`

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
