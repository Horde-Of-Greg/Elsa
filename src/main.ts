import { env } from './config/config';
import { app } from './core/App';
import { Events } from './core/Events';

async function main() {
    Events.initCore();
    app.core.logger.simpleLog('info', `Environment: ${env.ENVIRONMENT}`);
    await Events.initDb();
    await Events.initBot();
    await Events.seed();
}

main().catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
});
