import { Client, GatewayIntentBits } from 'discord.js';
import { parseCommand } from './utils/parser';
import { handleTag } from './commands/tag';
import { handleAddTag } from './commands/addtag';
import { handleSetRank } from './commands/setrank';
import { AppDataSource } from './db/dataSource';
import { Seeder } from './db/seeding/Seeder';
import { config, seedConfig } from './config/config';

AppDataSource.initialize()
    .then(async () => {
        if (process.env.ENVIRONMENT === 'development') {
            const seeder = new Seeder(seedConfig);
            await seeder.seed;
        }
    })
    .catch((error) => console.log(error));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.once('ready', async () => {
    console.log(`Bot ready as ${client.user?.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    const parsed = parseCommand(message.content, config.prefix);
    if (!parsed) return;
    const { command, args } = parsed;
    try {
        switch (command) {
            case 'tag':
                await handleTag(message, args);
                break;
            case 'addtag':
                await handleAddTag(message, args);
                break;
            case 'setrank':
                await handleSetRank(message, args);
                break;
            case 'cm': // command menu
                await message.reply(
                    `**${config.prefix} Command Menu**\n` +
                        `\`${config.prefix}tag <tag> <subtag>\`  –  show saved message (rank 0+)\n` +
                        `\`${config.prefix}addtag "tag" "subtag" "https://...msg-link"\`  –  save message (rank 3+)\n` +
                        `\`${config.prefix}setrank @User 0-5\`  –  change user rank (rank 4+)\n` +
                        `\`${config.prefix}CM\`  –  show this menu`,
                );
                break;
        }
    } catch (e) {
        console.error(e);
        message.reply('Internal error.');
    }
});

client.login(process.env.DISCORD_TOKEN);
