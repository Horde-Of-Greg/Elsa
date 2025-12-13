import { execSync } from "child_process";
import readline from "readline";
import "dotenv/config";
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

app.core.logger.simpleLog("warn", `WARNING: This will DELETE database: ${db}`);
rl.question("Are you sure you want to continue? (y/n): ", (answer) => {
    rl.close();

    if (!/^y(?:es)?$/i.test(answer.toLowerCase())) {
        app.core.logger.simpleLog("info", "Operation cancelled");
        process.exit(0);
    }

    app.core.logger.simpleLog("info", `Dropping database: ${db}`);

    try {
        execSync(`psql -U ${user} -h ${host} -d postgres -c "DROP DATABASE IF EXISTS ${db}"`, {
            stdio: "inherit",
        });
        app.core.logger.simpleLog("success", "✓ Database dropped successfully");
    } catch (error) {
        app.core.logger.simpleLog("error", "✗ Failed to drop database");
        process.exit(1);
    }
});
