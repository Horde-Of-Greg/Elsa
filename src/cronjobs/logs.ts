import nodeCron from "node-cron";

import { LogRotation } from "../core/logs/LogRotation";
import type { Dependencies } from "./../core/Dependencies";

export class CronScheduler {
    constructor(private readonly dependencies: Dependencies) {}

    setupAllTasks(): void {
        this.setupRotateBackups();
    }

    private setupRotateBackups(): void {
        nodeCron.schedule("0 0 * * *", async () => {
            this.dependencies.logger.warnUser("Rotating...");
            await new LogRotation(this.dependencies).main();
        });
    }
}
