/* eslint-disable no-console */
// Reasoning: This is the shutdown script, the logger won't, or may not be active.
import type { Dependencies } from "../core/Dependencies";
import { isActionsEnvironment } from "../utils/node/environment";

export class Stop {
    private isShuttingDown = false;
    private readonly SHUTDOWN_TIMEOUT_MS = 10000;

    constructor(private readonly dependencies: Dependencies) {}

    async gracefulShutdown(signal: string): Promise<void> {
        if (isActionsEnvironment()) process.exit(0);

        if (this.isShuttingDown) {
            console.warn(`Tried to shut down twice. Signal: ${signal} `);
            return;
        }
        this.isShuttingDown = true;

        console.info(`Received ${signal}, shutting down gracefully...\n`);

        const timeout = setTimeout(() => {
            console.error("Shutdown timeout - forcing exit");
            process.exit(1);
        }, this.SHUTDOWN_TIMEOUT_MS);

        try {
            console.log("Clearing caches...");
            await this.dependencies.cache.registry.reset();

            console.log("Closing DB...");
            await this.dependencies.database.dataSource.destroy();

            console.log("Disconnecting Redis...");
            await this.dependencies.cache.client.shutdown();

            console.log("Disconnecting Discord...");
            await this.dependencies.discord.bot.client.destroy();

            console.log("Flushing logs...");
            await this.dependencies.logger.shutdown();

            console.log("Cleanup completed successfully");
            clearTimeout(timeout);
            process.exit(0);
        } catch (error) {
            console.error("Error during shutdown:", error);
            clearTimeout(timeout);
            process.exit(1);
        }
    }
}
