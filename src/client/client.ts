import { Client, GatewayIntentBits } from 'discord.js';

const gatewayIntents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
];

export function makeClient() {
    return new Client({
        intents: gatewayIntents,
    });
}
