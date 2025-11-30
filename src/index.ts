import { bootstrap, Events } from './Events';
import { BotClient, getDcClient } from './client/BotClient';
import { env } from './config/config';
import { BotEventHandler } from './bot/BotEventHandler';

async function main() {
    await bootstrap();
    Events.initCore();

    const botClient = new BotClient();
    const dcClient = getDcClient();
    const eventHandler = new BotEventHandler(dcClient);

    dcClient.once('clientReady', () => eventHandler.onReady());
    dcClient.on('messageCreate', (m) => void eventHandler.onMessageCreate(m));

    dcClient.login(env.DISCORD_TOKEN);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
