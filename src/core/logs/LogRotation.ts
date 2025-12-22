import fs from "fs";
import path from "path";

import { appConfig } from "../../config/config";
import { env } from "../../config/env";
import { ReaddirError } from "../../errors/internal/schedules";
import { core } from "../Core";
import { consoleContainer } from "./ConsoleContainer";

export class LogRotation {
    private dirSize: number = 0;
    private files!: string[];
    private readonly dir = appConfig.LOGS.OUTPUT_PATH;
    private readonly maxSingleSizeBytes = 10 * 1024 * 1024;
    private readonly maxTotalSizeBytes = 25 * 1024 * 1024;

    async main(): Promise<void> {
        if (env.ENVIRONMENT !== "production") return;
        try {
            this.files = await fs.promises.readdir(this.dir);
            for (const file of this.files) {
                const filePath = path.join(this.dir, file);
                const stats = await fs.promises.stat(filePath);
                if (stats.isDirectory()) continue;

                if (stats.size >= this.maxSingleSizeBytes) {
                    await this.rotate();
                }
                this.dirSize += stats.size;
                if (this.dirSize >= this.maxTotalSizeBytes) {
                    await this.rotate();
                }
            }
        } catch (err) {
            throw new ReaddirError(err instanceof Error ? err : new Error(String(err)));
        }
    }

    private async rotate(): Promise<void> {
        await core.logger.stop();
        await consoleContainer.archiveLogs();
        await consoleContainer.clearLogs();
        core.logger.start();
    }
}
