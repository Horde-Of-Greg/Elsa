import dotenv from "dotenv";

import type { Env } from "./schema.js";
import { validateEnvs } from "./validate.js";

dotenv.config();

export const env: Env = validateEnvs();
