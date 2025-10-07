import { DataSource } from 'typeorm';
import { env } from '../config/config';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,

    migrations: ['src/db/migrations/*.ts'],
    entities: ['src/db/entities/*.ts'],
});
