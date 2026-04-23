import fs from "node:fs";
import path from "node:path";

import dotenv from "dotenv";
import type z from "zod";

export class Config<TSchema extends z.ZodObject> {
    data: z.infer<TSchema>;

    private readonly configsPath = "config";
    private readonly fileLocation: string;

    constructor(
        readonly fileName: string,
        readonly schema: TSchema,
    ) {
        if (fileName !== ".env") {
            this.fileLocation = path.join(this.configsPath, fileName);
        }
        this.data = this.validate();
    }

    private validate(): z.infer<TSchema> {
        const parsed = this.schema.safeParse(this.file);
        if (!parsed.success) {
            const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
            throw new Error(`Config validation failed: ${errors}`);
        }
        return parsed.data as z.infer<TSchema>;
    }

    private get file(): NodeJS.ProcessEnv | string {
        if (this.fileLocation === ".env") {
            dotenv.config();
            return process.env;
        }
        if (this.fileLocation.endsWith(".json")) {
            return JSON.parse(fs.readFileSync(this.fileLocation, "utf-8"));
        }
        return "";
    }
}
