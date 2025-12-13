import { DataSource } from "typeorm";

import { env } from "../config/config";

export function dataSourceConfig() {
    return new DataSource({
        type: "postgres",
        host: env.POSTGRES_HOST,
        port: env.POSTGRES_PORT,
        username: env.POSTGRES_USER,
        password: env.POSTGRES_PASSWORD,
        database: env.POSTGRES_DB,

        synchronize: env.ENVIRONMENT === "development", // Auto-create tables in development
        migrations: ["src/db/migrations/*.ts"],
        entities: ["src/db/entities/*.ts"],
    });
}
