<p align="center"><img src="https://github.com/Horde-Of-Greg/Branding/blob/master/Elsa/elsa-main-square.png" alt="Elsa Avatar" height="256"></p>
<h1 align="center">Elsa</h1>

<p align="center"><b></b>Discord Bot to save and execute tags.</b></p>
<h1 align="center">
    <a><img src="https://img.shields.io/github/last-commit/Horde-Of-Greg/Elsa?style=for-the-badge" alt="Last Commit">
    <a href="https://github.com/Horde-Of-Greg/Elsa/tags"><img src="https://img.shields.io/github/v/tag/Horde-Of-Greg/Elsa?include_prereleases&sort=semver&style=for-the-badge" alt="Last Tag">
    <a><img src="https://img.shields.io/github/actions/workflow/status/Horde-Of-Greg/Elsa/build.yml?branch=main&style=for-the-badge" alt="Build Status">
    <a><img src="https://img.shields.io/github/languages/top/Horde-Of-Greg/Elsa?style=for-the-badge" alt="Top Language"></a>

</h1>

# Features

- Add/Send tags that can be created by users.
- Create JS/TS(/more?) scripts for tags. Runs in a VM. (Coming).
- Every component of the tags are overridable by server, including banning/putting in a waiting list.
- Granular permissions. Every action has a configurable permission level attached.
- Not based on Discord roles, or slash commands.
- Extensive, configurable logging with automatic log rotations.

# External Dependencies

- **PostgreSQL** (DB)
- **Redis**/**Valkey** (Caching)
- [**zstd**](https://github.com/facebook/zstd) (Log Compression)

# Get the bot running

## 1. Clone the repo

```bash
git clone git@github.com:Horde-Of-Greg/Elsa-Discord-Tag-Bot.git
```

## 2. Set up a PG DB the bot can use

Use docker, figure it out. I'll explain more, mabye.

## 3. Copy the config templates to their respective files

```bash
find . -name '*.template' -exec sh -c 'cp "$0" "${0%.template}"' {} \;
```

## 4. Set up the configs

Edit the values in the `.env` (required) and `config/` (required).

See `docs/CONFIG.md`

## 5. Run the bot

### Production

```bash
npm ci # Clean install of dependencies
npm run build # Compile ts to js
npm start # Start the app
```

### Development

```bash
npm i # Install dependencies
npm run dev # Start the app without compilation
```
