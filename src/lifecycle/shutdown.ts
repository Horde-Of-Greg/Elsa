/* eslint-disable no-console */
// Reasoning: This is the shutdown script, the logger won't, or may not be active.
import { core } from "../core/Core";
import { dependencies } from "../core/Dependencies";
import { isActionsEnvironment } from "../utils/node/environment";

let isShuttingDown = false;
const SHUTDOWN_TIMEOUT_MS = 10000;

export async function gracefulShutdown(signal: string): Promise<void> {
    if (isActionsEnvironment()) process.exit(0);

    if (isShuttingDown) {
        console.warn(`Tried to shut down twice. Signal: ${signal} `);
        return;
    }
    isShuttingDown = true;

    console.info(`Received ${signal}, shutting down gracefully...\n`);

    const timeout = setTimeout(() => {
        console.error("Shutdown timeout - forcing exit");
        process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);

    try {
        console.log("Clearing caches...");
        await dependencies.cache.registry.clearAll();

        console.log("Closing DB...");
        await dependencies.database.dataSource.destroy();

        console.log("Disconnecting Redis...");
        await dependencies.cache.client.shutdown();

        console.log("Disconnecting Discord...");
        await dependencies.discord.bot.client.destroy();

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
