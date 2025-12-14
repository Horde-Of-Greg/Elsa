import "dotenv/appConfig";

import { execSync } from "child_process";
import readline from "readline";

import { app } from "../../core/App";

const user = process.env.POSTGRES_USER;
const host = process.env.POSTGRES_HOST;
const db = process.env.POSTGRES_DB;
const environment = process.env.ENVIRONMENT;

if (environment !== "development") {
    process.exit(1);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

app.core.logger.warn(`WARNING: This will DELETE ALL DATA in database: ${db}`);
rl.question("Are you sure you want to continue? (y/n): ", (answer) => {
    rl.close();

    if (!/^y(?:es)?$/i.test(answer.toLowerCase())) {
        app.core.logger.info("Operation cancelled");
        process.exit(0);
    }

    app.core.logger.info(`Resetting database: ${db}`);

    try {
        app.core.logger.info("Dropping existing database...");
        execSync(`psql -U ${user} -h ${host} -d postgres -c "DROP DATABASE IF EXISTS ${db}"`, {
            stdio: "inherit",
        });

        app.core.logger.info("Creating new database...");
        execSync(`psql -U ${user} -h ${host} -d postgres -c "CREATE DATABASE ${db}"`, {
            stdio: "inherit",
        });

        app.core.logger.info("✓ Database reset successfully");
    } catch (error) {
        app.core.logger.error("✗ Failed to reset database");
        process.exit(1);
    }
});
