import { Message } from 'discord.js';
import { query } from '../database/connection';
import { parseAddTagArgs } from '../utils/parser';
import { hasRank } from '../utils/permissions';
import { config } from '../config/config';
import { promises as fs } from 'fs';
import path from 'path';
export async function handleAddTag(message: Message, args: string[]): Promise<void> {
  if (!(await hasRank(message.member!, config.cmdMinRank.addtag))) {
    await message.reply('Admin+ rank required.');
    return;
  }
  try {
    const { tag, subtag, messageLink } = parseAddTagArgs(args);
    const urlMatch = messageLink.match(/^https:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)$/);
    if (!urlMatch) { await message.reply('Bad Discord message link.'); return; }

    const [, , channelId, msgId] = urlMatch;
    const channel = await message.client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) { await message.reply('Cannot fetch channel.'); return; }
    const srcMsg = await channel.messages.fetch(msgId);

    const dir = path.join(config.storagePath, tag);
    await fs.mkdir(dir, { recursive: true });
    const filePath = path.join(dir, `${subtag}.txt`);
    await fs.writeFile(filePath, srcMsg.content || 'No text', 'utf-8');

    await query(
      'INSERT INTO tags (tag_name, subtag_name, message_link, file_path, created_by) VALUES ($1,$2,$3,$4,$5)',
      [tag.toLowerCase(), subtag.toLowerCase(), messageLink, filePath, message.author.id]
    );
    await message.reply('Tag created.');
  } catch (e: any) {
    await message.reply(e.message.includes('format') ? e.message : 'Unknown error.');
  }
}