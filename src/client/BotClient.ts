import { Client, GatewayIntentBits } from 'discord.js';
import { config } from '../config/config';

export class BotClient {
    name: string;
    dcClient: Client;

    constructor() {
        this.name = config.NAME;
        this.makeClient();
    }

    static gatewayIntents = [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ];

    makeClient() {
        this.dcClient = new Client({
            intents: BotClient.gatewayIntents,
        });
    }
}
