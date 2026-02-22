import { execSync } from "child_process";

import { env } from "../../src/config/env";
import { core } from "../../src/core/Core";

const user = env.POSTGRES_USER;
const host = env.POSTGRES_HOST;
const db = env.POSTGRES_DB;

core.logger.info(`Connecting to database: ${db}`);

try {
    execSync(`psql -U ${user} -h ${host} -d ${db}`, { stdio: "inherit" });
} catch (error) {
    process.exit(0);
}
