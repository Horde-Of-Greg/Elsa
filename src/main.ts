import { env } from './config/config';
import { app } from './core/App';
import { Events } from './core/Events';

async function main() {
    app.core.logger.sectionLog('Initializing');
    Events.initCore();
    app.core.logger.simpleLog('info', `Environment: ${env.ENVIRONMENT}`);
    await Events.initDb();
    await Events.initBot();
    await Events.seed();
    app.core.logger.sectionLog(`Init Done (${app.core.queryTimer('main').getTime().formatted})`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
