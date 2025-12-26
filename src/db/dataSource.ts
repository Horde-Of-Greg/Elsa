import { DataSource } from "typeorm";

import { env } from "../config/env";

export const dataSourceappConfig = new DataSource({
    type: "postgres",
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,

    synchronize: process.env.NODE_ENV === "development", // Auto-create tables in development

    migrations: [
        process.env.NODE_ENV === "production" ? "dist/db/migrations/**/*.js" : "src/db/migrations/**/*.ts",
    ],

    entities: [
        process.env.NODE_ENV === "production" ? "dist/db/entities/**/*.js" : "src/db/entities/**/*.ts",
    ],
});
