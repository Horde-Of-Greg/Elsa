import { env } from "./config/appConfig";
import { app } from "./core/App";
import { Events } from "./core/Events";
import { gracefulShutdown } from "./handlers/shutdown";

async function main() {
    Events.initCore();
    app.core.logger.info(`Environment: ${env.ENVIRONMENT}`);
    await Events.initDb();
    await Events.initBot();
    await Events.seed();
}

main().catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
});

process.on("SIGINT", () => void gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => void gracefulShutdown("SIGTERM"));
process.on("SIGHUP", () => void gracefulShutdown("SIGHUP"));

process.on("uncaughtException", (error) => {
    // eslint-disable-next-line no-console
    console.error("Uncaught Exception:", error);
    void gracefulShutdown("uncaughtException").then(() => process.exit(1));
});

process.on("unhandledRejection", (reason, promise) => {
    // eslint-disable-next-line no-console
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    void gracefulShutdown("unhandledRejection").then(() => process.exit(1));
});
