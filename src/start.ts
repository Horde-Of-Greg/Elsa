import { execSync } from "child_process";

import { isProductionEnvironment } from "./utils/environment";

if (!isProductionEnvironment()) {
    throw new Error("start is only meant for production.");
}

execSync("npm start");
