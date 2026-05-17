import { execSync } from "child_process";
import readline from "readline";

import { process } from "../../src/config/process";
import { core } from "../../src/core/Core";

const user = process.env.POSTGRES_USER;
const host = process.env.POSTGRES_HOST;
const db = process.env.POSTGRES_DB;
export const environment = process.env.NODE_ENV;

if (environment !== "development") {
    console.error(
        `Database reset can only be run in the development environment. Current NODE_ENV is: ${environment ?? "undefined"}`,
    );
    process.exit(1);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.warn(`WARNING: This will DELETE ALL DATA in database: ${db}`);
rl.question("Are you sure you want to continue? (y/n): ", (answer) => {
    rl.close();

    if (!/^y(?:es)?$/i.test(answer.toLowerCase())) {
        console.info("Operation cancelled");
        process.exit(0);
    }

    console.info(`Resetting database: ${db}`);

    try {
        console.info("Dropping existing database...");
        execSync(`psql -U ${user} -h ${host} -d postgres -c "DROP DATABASE IF EXISTS ${db}"`, {
            stdio: "inherit",
        });

        console.info("Creating new database...");
        execSync(`psql -U ${user} -h ${host} -d postgres -c "CREATE DATABASE ${db}"`, {
            stdio: "inherit",
        });

        console.info("✓ Database reset successfully");
    } catch (error) {
        console.error("✗ Failed to reset database");
        process.exit(1);
    }
});
