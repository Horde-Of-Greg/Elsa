import { DataSource } from "typeorm";

import { env } from "../config/env";
import { isProductionEnvironment } from "../utils/node/environment";

export const dataSourceappConfig = new DataSource({
    type: "postgres",
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,

    synchronize: true, // isDevelopmentEnvironment(), // Auto-create tables in development

    migrations: [isProductionEnvironment() ? "dist/db/migrations/**/*.js" : "src/db/migrations/**/*.ts"],

    entities: [isProductionEnvironment() ? "dist/db/entities/**/*.js" : "src/db/entities/**/*.ts"],
});
