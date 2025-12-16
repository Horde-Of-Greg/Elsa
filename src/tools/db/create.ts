import "dotenv/appConfig";

import { execSync } from "child_process";

import { env } from "../../config/env";
import { core } from "../../core/Core";

const user = env.POSTGRES_USER;
const host = env.POSTGRES_HOST;
export const db = env.POSTGRES_DB;

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
