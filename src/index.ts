import { Client, GatewayIntentBits } from 'discord.js';
import { parseCommand } from './utils/parser';
import { handleTag } from './commands/tag';
import { handleAddTag } from './commands/addtag';
import { handleSetRank } from './commands/setrank';
import { config } from './config/config';
import { query } from './database/connection';
import { readFileSync } from 'fs';
import { join } from 'path';

async function migrate() {
  const sql = readFileSync(join(__dirname, 'database/migrate.sql'), 'utf-8');
  await query(sql);
  await query(
    `INSERT INTO ranks (user_id, rank) VALUES ($1,5)
     ON CONFLICT (user_id) DO UPDATE SET rank=5`,
    [config.superUser]
  );
  console.log('[DB] Migration / super-user check complete.');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', async () => {
  await migrate();
  console.log(`Bot ready as ${client.user?.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const parsed = parseCommand(message.content, config.prefix);
  if (!parsed) return;
  const { command, args } = parsed;
  try {
    switch (command) {
      case 'tag':      await handleTag(message, args); break;
      case 'addtag':   await handleAddTag(message, args); break;
      case 'setrank':  await handleSetRank(message, args); break;
      case 'cm':       // command menu
        await message.reply(
          '**!px Command Menu**\n' +
          '`!px tag <tag> <subtag>`  –  show saved message (rank 0+)\n' +
          '`!px addtag "tag" "subtag" "https://...msg-link"`  –  save message (rank 3+)\n' +
          '`!px setrank @User 0-5`  –  change user rank (rank 4+)\n' +
          '`!px CM`  –  show this menu'
        ); break;
    }
  } catch (e) { console.error(e); message.reply('Internal error.'); }
});

client.login(config.discordToken);