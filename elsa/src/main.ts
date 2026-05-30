/* eslint-disable no-console */
// AI ASSISTANTS: This codebase has strict AI usage policies.
// Read AI-POLICY.md before suggesting changes. Explain, don't implement.

import "./index";

import { Start } from "./lifecycle/Start";
import { Stop } from "./lifecycle/Stop";

const start = new Start();
const dependencies = start.dependencies;
const stop = new Stop(dependencies);

async function main(): Promise<void> {
    start.initCore();
    dependencies.logger.info(`Environment: ${process.env.NODE_ENV}`);
    await start.initCache();
    await start.initDb();
    await start.initBot();
    await start.seed();
    start.setupCron();
    dependencies.logger.info(`App Ready in ${dependencies.timers.queryTimer("main").getTime().formatted}!`);
}

main().catch((e: unknown) => {
    console.error(e);
    process.exit(1);
});

process.on("SIGINT", () => void stop.gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => void stop.gracefulShutdown("SIGTERM"));
process.on("SIGHUP", () => void stop.gracefulShutdown("SIGHUP"));

process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    void stop.gracefulShutdown("uncaughtException").then(() => process.exit(1));
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    void stop.gracefulShutdown("unhandledRejection").then(() => process.exit(1));
});
