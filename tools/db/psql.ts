import { execSync } from "child_process";

import { core } from "../../src/core/Core";

const user = process.env.POSTGRES_USER;
const host = process.env.POSTGRES_HOST;
const db = process.env.POSTGRES_DB;

core.logger.info(`Connecting to database: ${db}`);

try {
    execSync(`psql -U ${user} -h ${host} -d ${db}`, { stdio: "inherit" });
} catch (error) {
    process.exit(0);
}
