import { DataSource } from "typeorm";

import { env } from "../config/env";

export function dataSourceappConfig() {
    return new DataSource({
        type: "postgres",
        host: env.POSTGRES_HOST,
        port: env.POSTGRES_PORT,
        username: env.POSTGRES_USER,
        password: env.POSTGRES_PASSWORD,
        database: env.POSTGRES_DB,

        synchronize: process.env.NODE_ENV === "development", // Auto-create tables in development
        migrations: ["src/db/migrations/*.ts"],
        entities: ["src/db/entities/*.ts"],
    });
}
