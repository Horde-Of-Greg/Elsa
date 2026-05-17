import fs from "node:fs";
import path from "node:path";

import { ErrorNotAnErrorError } from "../../errors/internal/critical";
import { ReaddirError } from "../../errors/internal/schedules";
import { isProductionEnvironment } from "../../utils/node/environment";
import type { Dependencies } from "./../Dependencies";

export class LogRotation {
    private dirSize = 0;
    private files!: string[];
    private readonly maxSingleSizeBytes = 10 * 1024 * 1024;
    private readonly maxTotalSizeBytes = 25 * 1024 * 1024;

    constructor(private readonly dependencies: Dependencies) {}

    async main(): Promise<void> {
        const dir = this.dependencies.configs.app.LOGS.OUTPUT_PATH;
        if (!isProductionEnvironment()) return;
        try {
            this.files = await fs.promises.readdir(dir);
            for (const file of this.files) {
                const filePath = path.join(dir, file);
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
        } catch (err: unknown) {
            throw new ReaddirError(err instanceof Error ? err : new ErrorNotAnErrorError(err));
        }
    }

    private async rotate(): Promise<void> {
        await this.dependencies.logger.stop();
        await this.dependencies.consoles.archiveLogs();
        await this.dependencies.consoles.clearLogs();
        this.dependencies.logger.start();
    }
}
