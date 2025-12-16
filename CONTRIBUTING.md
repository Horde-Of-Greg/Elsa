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

### `BREAK`

`BREAKING` commits are any commits which cause a breaking change for the user. Breaking changes are changes which will remove an existing feature, or change it in a non backwards compatible way.

They will trigger a `Major` bump

### `FEAT`

`FEAT` commits are commits which will add a feature to the app.

They will trigger a `Minor` bump

### `FIX`

`FIX` commits solve an existing bug without adding any new features.

They will trigger a `Patch` bump

### `DOCS`

`DOCS` commits are documentation-only changes. This includes updates to README files, API documentation, code comments, or other documentation files.

They will **not** trigger a version bump

### `STYLE`

`STYLE` commits are changes that do not affect the meaning of the code. Mostly changes to the formatter.

They will **not** trigger a version bump

### `REFACTOR`

`REFACTOR` commits change the existing code to be either be more readable or maintainable, without changing its logic.

They will **not** trigger a version bump

### `TEST`

`TEST` commits relate to tests.

They will **not** trigger a version bump

### `CI`

`CI` commits are changes to the CI/CD configuration and scripts.

They will **not** trigger a version bump
