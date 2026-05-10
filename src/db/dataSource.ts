import { DataSource } from "typeorm";

import { Configs } from "../config/Configs";
import { isProductionEnvironment } from "../utils/node/environment";

export const dataSourceAppConfig = new DataSource({
    type: "postgres",
    host: Configs.env.POSTGRES_HOST,
    port: Configs.env.POSTGRES_PORT,
    username: Configs.env.POSTGRES_USER,
    password: Configs.env.POSTGRES_PASSWORD,
    database: Configs.env.POSTGRES_DB,

    synchronize: true, // isDevelopmentEnvironment(), // Auto-create tables in development

    migrations: [isProductionEnvironment() ? "dist/db/migrations/**/*.js" : "src/db/migrations/**/*.ts"],

    entities: [isProductionEnvironment() ? "dist/db/entities/**/*.js" : "src/db/entities/**/*.ts"],
});
