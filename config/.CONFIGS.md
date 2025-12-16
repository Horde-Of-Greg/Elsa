# Configuration Documentation

## Env

| Name              | Type   | Description                 | Required        | Default       |
| ----------------- | ------ | --------------------------- | --------------- | ------------- |
| ENVIRONMENT       | enum   | Environment the app runs in | `False`         | `development` |
| DISCORD_TOKEN     | string | Discord Token to use        | `True`          | none          |
| POSTGRES_HOST     | string | Hostname/IP for postgres    | `True` (non-CI) | none          |
| POSTGRES_PORT     | int    | Port to use for postgres    | `False`         | `5432`        |
| POSTGRES_DB       | string | Database name               | `True` (non-CI) | none          |
| POSTGRES_USER     | string | Database username           | `True` (non-CI) | none          |
| POSTGRES_PASSWORD | string | Database password           | `True` (non-CI) | none          |

> **Note:** Postgres fields are only required when `ENVIRONMENT` is not `actions`.

### Environment Values

| Value         | Description                     |
| ------------- | ------------------------------- |
| `development` | Local development               |
| `test`        | Running tests                   |
| `production`  | Production deployment           |
| `actions`     | GitHub Actions (no DB required) |

## App Config

Located in `config/appConfig.json`

| Name                     | Type    | Description                          | Required | Default |
| ------------------------ | ------- | ------------------------------------ | -------- | ------- |
| PREFIX                   | string  | Command prefix (1-3 chars)           | `False`  | `!`     |
| NAME                     | string  | Bot display name                     | `True`   | none    |
| LOGS.VERBOSE_LOGGING     | boolean | Enable verbose logging               | `True`   | none    |
| LOGS.OUTPUT_PATH         | string  | Directory for log files              | `True`   | none    |
| LOGS.ALLOW_ABSOLUTE_PATH | boolean | Allow absolute paths for OUTPUT_PATH | `True`   | none    |

> **Note:** If `ALLOW_ABSOLUTE_PATH` is `false`, `OUTPUT_PATH` must be a relative path (no leading `/`).

## Seeder Config

Located in `config/seeder_config.json`. Used for database seeding during development.

| Name               | Type     | Description                                 | Required | Default |
| ------------------ | -------- | ------------------------------------------- | -------- | ------- |
| DEPTH              | int      | Number of seed entries to create (1-100000) | `True`   | none    |
| DROP_DB            | boolean  | Drop database before seeding                | `True`   | none    |
| WAIT_TO_DROP_DB    | boolean  | Wait for confirmation before dropping       | `False`  | `true`  |
| SUDOERS.DO_SUDOERS | boolean  | Create sudoer entries                       | `True`   | none    |
| SUDOERS.USERS      | string[] | Discord User IDs to make sudoers            | `True`   | none    |
| SUDOERS.GUILDS     | string[] | Discord Guild IDs for sudoer scope          | `True`   | none    |
