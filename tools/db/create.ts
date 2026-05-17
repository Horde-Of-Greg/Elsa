import { execSync } from "child_process";

const user = process.env.POSTGRES_USER;
const host = process.env.POSTGRES_HOST;
export const db = process.env.POSTGRES_DB;

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
