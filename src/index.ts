import { bootstrap } from './bootstrap';
import { BotClient, getDcClient } from './client/BotClient';
import { env } from './config/config';
import { EventHandler } from './handlers/EventHandler';

async function main() {
    await bootstrap();

    const botClient = new BotClient();
    const dcClient = getDcClient();
    const eventHandler = new EventHandler(dcClient);

    dcClient.once('clientReady', () => eventHandler.onReady());
    dcClient.on('messageCreate', (m) => void eventHandler.onMessageCreate(m));

    dcClient.login(env.DISCORD_TOKEN);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
