/* eslint-disable no-console */
// Reasoning: This is the shutdown script, the logger won't, or may not be active.
import { env } from "../config/env";
import { core } from "../core/Core";
import { dependencies } from "../core/Dependencies";

let isShuttingDown = false;

export async function gracefulShutdown(signal: string): Promise<void> {
    if (env.ENVIRONMENT === "actions") process.exit(0);

    if (isShuttingDown) {
        console.warn(`Tried to shut down twice. Signal: ${signal} `);
        return;
    }
    isShuttingDown = true;

    core.logger.info(`Received ${signal}, shutting down gracefully...\n`);

    const timeout = setTimeout(() => {
        console.error("Shutdown timeout - forcing exit");
        process.exit(1);
    }, 10000);

    try {
        console.log("Disconnecting Discord...");
        await dependencies.database.dataSource.destroy();

        console.log("Closing DB...");
        await core.discord.bot.client.destroy();

        console.log("Flushing logs...");
        await core.logger.shutdown();

        console.log("Cleanup completed successfully");
        clearTimeout(timeout);
        process.exit(0);
    } catch (error) {
        console.error("Error during shutdown:", error);
        clearTimeout(timeout);
        process.exit(1);
    }
}
