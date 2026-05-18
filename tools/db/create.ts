import { execSync } from "child_process";

import { env } from "../env/env";

const user = env.POSTGRES_USER;
const host = env.POSTGRES_HOST;
const db = env.POSTGRES_DB;

console.info(`Creating database: ${db}`);

try {
    execSync(`psql -U ${user} -h ${host} -d postgres -c "CREATE DATABASE ${db}"`, {
        stdio: "inherit",
    });
    console.info("✓ Database created successfully");
} catch (error) {
    console.error("✗ Failed to create database");
    process.exit(1);
}
