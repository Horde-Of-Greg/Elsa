import { execSync } from "child_process";

import { core } from "../../src/core/Core";
import { dependencies } from "./../../src/core/Dependencies";

const user = dependencies.config.env.POSTGRES_USER;
const host = dependencies.config.env.POSTGRES_HOST;
export const db = dependencies.config.env.POSTGRES_DB;

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
