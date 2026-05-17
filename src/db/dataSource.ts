import { DataSource } from "typeorm";

import type { ConfigsResolver } from "../types/config/config";
import { isProductionEnvironment } from "../utils/node/environment";

export function dataSource(configs: ConfigsResolver): DataSource {
    return new DataSource({
        type: "postgres",
        host: configs.env.POSTGRES_HOST,
        port: configs.env.POSTGRES_PORT,
        username: configs.env.POSTGRES_USER,
        password: configs.env.POSTGRES_PASSWORD,
        database: configs.env.POSTGRES_DB,

        synchronize: true, // isDevelopmentEnvironment(), // Auto-create tables in development

        migrations: [isProductionEnvironment() ? "dist/db/migrations/**/*.js" : "src/db/migrations/**/*.ts"],

        entities: [isProductionEnvironment() ? "dist/db/entities/**/*.js" : "src/db/entities/**/*.ts"],
    });
}
