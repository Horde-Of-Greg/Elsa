import { execSync } from "child_process";

import { env } from "../env/env";

const user = env.POSTGRES_USER;
const host = env.POSTGRES_HOST;
const db = env.POSTGRES_DB;

console.info(`Connecting to database: ${db}`);

try {
    execSync(`psql -U ${user} -h ${host} -d ${db}`, { stdio: "inherit" });
} catch (error) {
    process.exit(0);
}
