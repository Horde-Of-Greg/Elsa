import { env } from "../../config/appConfig";
import { app } from "../../core/App";

export function requireActionsEnv() {
    if (env.ENVIRONMENT !== "actions") {
        app.core.logger.error('Tried to run an actions script inside a dev other than "actions".');
    }
    process.exit(1);
}
