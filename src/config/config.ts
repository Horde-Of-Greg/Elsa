import dotenv from 'dotenv';
dotenv.config();
const tok = process.env.DISCORD_TOKEN;
if (!tok || tok.length < 50) {
  console.error('[FATAL] Discord token missing or too short.  Check .env file.');
  process.exit(1);
}
export const RANKS = ['none','trusted','mod','admin','superadmin','owner'] as const;
export type Rank = typeof RANKS[number];

export const config = {
  discordToken: tok,
  prefix: process.env.PREFIX || '!px ',
  superUser: process.env.SUPER_USER!,
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DB || 'discord_tags',
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!
  },
  cmdMinRank: { tag: 0, addtag: 3, setrank: 4 },
  storagePath: './storage/tags'
};