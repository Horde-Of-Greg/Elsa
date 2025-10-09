import { bootstrap } from './bootstrap';
import { BotClient, getDcClient } from './client/client';
import { EventHandler } from './handlers/EventHandler';

async function main() {
    await bootstrap();

    const botClient = new BotClient();
    const dcClient = getDcClient();
    const handler = new EventHandler(dcClient);

    dcClient.once('ready', () => handler.onReady());
    dcClient.on('messageCreate', (m) => void handler.onMessageCreate(m));

    console.log('Bot Successfully Started');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
