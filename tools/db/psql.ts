import { execSync } from "child_process";

import { Configs } from "../../src/config/Configs";
import { core } from "../../src/core/Core";

const user = Configs.env.POSTGRES_USER;
const host = Configs.env.POSTGRES_HOST;
const db = Configs.env.POSTGRES_DB;

core.logger.info(`Connecting to database: ${db}`);

try {
    execSync(`psql -U ${user} -h ${host} -d ${db}`, { stdio: "inherit" });
} catch (error) {
    process.exit(0);
}
