import { bootstrap } from './bootstrap';
import { BotClient, getDcClient } from './client/BotClient';
import { env } from './config/config';
import { EventHandler } from './handlers/EventHandler';

async function main() {
    await bootstrap();

    const botClient = new BotClient();
    const dcClient = getDcClient();
    const handler = new EventHandler(dcClient);

    dcClient.once('clientReady', () => handler.onReady());
    dcClient.on('messageCreate', (m) => void handler.onMessageCreate(m));

    dcClient.login(env.DISCORD_TOKEN);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
