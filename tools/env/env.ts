import dotenv from "dotenv";

import { type Env, EnvSchema } from "./env.schema";

dotenv.config({ path: "../.env" });
const parsedEnv = EnvSchema.safeParse(process.env);
if (!parsedEnv.success) {
    const errors = parsedEnv.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Config validation failed: ${errors}`);
}
export const env: Env = parsedEnv.data;
