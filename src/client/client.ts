import { Client, GatewayIntentBits } from 'discord.js';
import { config } from '../config/config';

let client: BotClient;

export class BotClient {
    name: string;
    dcClient: Client;

    constructor() {
        if (typeof client === 'undefined') {
            client = this;
        } else {
            throw new Error('Tried to construct the Discord Client twice');
        }
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

export function getBotClient() {
    return client;
}

export function getDcClient() {
    return client.dcClient;
}
