import { execSync } from "child_process";

import { isProductionEnvironment } from "./utils/node/environment";

if (!isProductionEnvironment()) {
    throw new Error("start is only meant for production.");
}

execSync("npm start");
