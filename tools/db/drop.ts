import { execSync } from "child_process";
import readline from "readline";

import { env } from "../../src/config/env";
import { core } from "../../src/core/Core";

const user = env.POSTGRES_USER;
const host = env.POSTGRES_HOST;
const db = env.POSTGRES_DB;
const environment = process.env.NODE_ENV;

if (environment !== "development") {
    core.logger.error(
        `Database reset can only be run in the development environment. Current NODE_ENV is: ${environment ?? "undefined"}`,
    );
    process.exit(1);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

core.logger.warn(`WARNING: This will DELETE database: ${db}`);
rl.question("Are you sure you want to continue? (y/n): ", (answer) => {
    rl.close();

    if (!/^y(?:es)?$/i.test(answer.toLowerCase())) {
        core.logger.info("Operation cancelled");
        process.exit(0);
    }

    core.logger.info(`Dropping database: ${db}`);

    try {
        execSync(`psql -U ${user} -h ${host} -d postgres -c "DROP DATABASE IF EXISTS ${db}"`, {
            stdio: "inherit",
        });
        core.logger.info("✓ Database dropped successfully");
    } catch (error) {
        core.logger.error("✗ Failed to drop database");
        process.exit(1);
    }
});
