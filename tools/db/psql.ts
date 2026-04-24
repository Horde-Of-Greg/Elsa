import { execSync } from "child_process";

import { core } from "../../src/core/Core";
import { dependencies } from "../../src/core/Dependencies";

const user = dependencies.config.env.POSTGRES_USER;
const host = dependencies.config.env.POSTGRES_HOST;
const db = dependencies.config.env.POSTGRES_DB;

core.logger.info(`Connecting to database: ${db}`);

try {
    execSync(`psql -U ${user} -h ${host} -d ${db}`, { stdio: "inherit" });
} catch (error) {
    process.exit(0);
}
