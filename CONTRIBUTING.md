# Standards

## Naming

### 1. No shortening variables names

Do not shorten variables names, except for units (see below). This just makes things confusing. Exceptions might apply in specific cases.

`Example`: shortening like `tagHostService` to `thServ`, is the best way to forget what `thServ` is.

### 2. Suffix units

Say we have variables `time` in method1 and method2, but method1 works in seconds, and method2 in ms. This is the perfect way to create a bug if not properly named. So make sure they are named `time_s` and `time_ms`.

### 3. Casing

- `Classes`: `PascalCase`
- `functions`: `camelCase()`
- `variables`: `camelCase`
- `CONSTANTS`: `ALL_CAPS_SNAKE_CASE`
- `script-name`: `kebab-case`

## Linting/Formatting

Linting and formatting are handled by `eslint` and `prettier` respectively. Make sure you submit code which passes these lints and formats, otherwise it will get rejected.

There are two ways to do this:

### 1. Extensions/Plugins + Format on save

This really will depend on your IDE. For VSC, we recommend using the workspace options provided by the repo in `.vscode/` along with [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

### 2. Manually with npm run

We do not recommend doing this as it is easy to forget, and tedious, but nonetheless, you can run `npm run lint:fix` and `npm run format` to apply those to the entire repo.
