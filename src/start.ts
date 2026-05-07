import { execSync } from "node:child_process";

import { WrongEntryPointError } from "./errors/internal/lifecycle";
import { isProductionEnvironment } from "./utils/node/environment";

if (!isProductionEnvironment()) {
    throw new WrongEntryPointError("main.ts", "start.ts", "start.ts should only be used for production.");
}

execSync("npm start");
