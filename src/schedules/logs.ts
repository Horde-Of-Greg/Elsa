import nodeCron from "node-cron";

import { app } from "../core/App";
import { LogRotation } from "../core/logs/LogRotation";

// Every day at midnight
nodeCron.schedule("0 0 * * *", async () => {
    app.core.logger.warnUser("Rotating...");
    await new LogRotation().main();
});
