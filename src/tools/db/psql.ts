import { execSync } from 'child_process';
import 'dotenv/config';
import { app } from '../../core/App';

const user = process.env.POSTGRES_USER;
const host = process.env.POSTGRES_HOST;
const db = process.env.POSTGRES_DB;

app.core.logger.simpleLog('info', `Connecting to database: ${db}`);

try {
    execSync(`psql -U ${user} -h ${host} -d ${db}`, { stdio: 'inherit' });
} catch (error) {
    process.exit(0);
}
