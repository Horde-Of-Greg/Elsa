import { DataSource } from "typeorm";

import { isProductionEnvironment } from "../utils/node/environment";
import { dependencies } from "./../core/Dependencies";

export const dataSourceAppConfig = new DataSource({
    type: "postgres",
    host: dependencies.config.env.POSTGRES_HOST,
    port: dependencies.config.env.POSTGRES_PORT,
    username: dependencies.config.env.POSTGRES_USER,
    password: dependencies.config.env.POSTGRES_PASSWORD,
    database: dependencies.config.env.POSTGRES_DB,

    synchronize: true, // isDevelopmentEnvironment(), // Auto-create tables in development

    migrations: [isProductionEnvironment() ? "dist/db/migrations/**/*.js" : "src/db/migrations/**/*.ts"],

    entities: [isProductionEnvironment() ? "dist/db/entities/**/*.js" : "src/db/entities/**/*.ts"],
});
