import type z from "zod";

export type ConfigParams = {
    name: string;
    fileLocation: string;
    schema: z.ZodObject;
};

export type ConfigData = Record<string, unknown>;
