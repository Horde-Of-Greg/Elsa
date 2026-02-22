import nodeCron from "node-cron";

import { core } from "../core/Core.js";
import { LogRotation } from "../core/logs/LogRotation.js";

// Every day at midnight
nodeCron.schedule("0 0 * * *", async () => {
    core.logger.warnUser("Rotating...");
    await new LogRotation().main();
});
