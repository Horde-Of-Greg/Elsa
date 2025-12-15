import dotenv from "dotenv";

import type { Env } from "./schema";
import { validateEnvs } from "./validate";

dotenv.config();

export const env: Env = validateEnvs();
