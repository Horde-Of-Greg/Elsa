import { Events } from './core/Events';

async function main() {
    Events.initCore();
    Events.initDb();
    Events.initBot();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
