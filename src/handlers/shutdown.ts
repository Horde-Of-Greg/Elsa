/* eslint-disable no-console */
// Reasoning: This is the shutdown script, the logger won't, or may not be active.
import { app } from "../core/App";

let isShuttingDown = false;

export async function gracefulShutdown(signal: string): Promise<void> {
    if (isShuttingDown) {
        console.warn(`Tried to shut down twice. Signal: ${signal} `);
        return;
    }
    isShuttingDown = true;

    app.core.logger.info(`Received ${signal}, shutting down gracefully...\n`);

    const timeout = setTimeout(() => {
        console.error("Shutdown timeout - forcing exit");
        process.exit(1);
    }, 10000);

    try {
        console.log("Disconnecting Discord...");
        await app.database.dataSource.destroy();

        console.log("Closing DB...");
        await app.discord.bot.client.destroy();

        console.log("Flushing logs...");
        await app.core.logger.shutdown();

        console.log("Cleanup completed successfully");
        clearTimeout(timeout);
        process.exit(0);
    } catch (error) {
        console.error("Error during shutdown:", error);
        clearTimeout(timeout);
        process.exit(1);
    }
}
