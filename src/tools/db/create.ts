import { execSync } from "child_process";
import "dotenv/config";
import { app } from "../../core/App";
import { env } from "../../config/config";

const user = env.POSTGRES_USER;
const host = env.POSTGRES_HOST;
export const db = env.POSTGRES_DB;

app.core.logger.simpleLog("info", `Creating database: ${db}`);

try {
    execSync(`psql -U ${user} -h ${host} -d postgres -c "CREATE DATABASE ${db}"`, {
        stdio: "inherit",
    });
    app.core.logger.simpleLog("success", "✓ Database created successfully");
} catch (error) {
    app.core.logger.simpleLog("error", "✗ Failed to create database");
    process.exit(1);
}
