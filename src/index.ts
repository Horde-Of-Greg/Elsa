import { bootstrap } from './bootstrap';
import { makeClient } from './client/client';
import { EventHandler } from './handlers/EventHandler';

async function main() {
    await bootstrap();

    const client = makeClient();
    const handler = new EventHandler(client);

    client.once('ready', () => handler.onReady());
    client.on('messageCreate', (m) => void handler.onMessageCreate(m));
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
