import { execSync } from "child_process";

import { Configs } from "../../src/config/Configs";
import { core } from "../../src/core/Core";

const user = Configs.env.POSTGRES_USER;
const host = Configs.env.POSTGRES_HOST;
export const db = Configs.env.POSTGRES_DB;

core.logger.info(`Creating database: ${db}`);

try {
    execSync(`psql -U ${user} -h ${host} -d postgres -c "CREATE DATABASE ${db}"`, {
        stdio: "inherit",
    });
    core.logger.info("✓ Database created successfully");
} catch (error) {
    core.logger.error("✗ Failed to create database");
    process.exit(1);
}
