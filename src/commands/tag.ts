import { Message } from 'discord.js';
import { query } from '../database/connection';
import { promises as fs } from 'fs';
export async function sendTag(message: Message, args: string[]): Promise<void> {
    if (args.length < 2) {
        await message.reply('Usage: !px tag <tag> <subtag…>');
        return;
    }
    const tagName = args[0].toLowerCase();
    const subtagName = args.slice(1).join(' ').toLowerCase();

    const res = await query('SELECT * FROM tags WHERE tag_name=$1 AND subtag_name=$2', [
        tagName,
        subtagName,
    ]);
    if (res.rows.length === 0) {
        await message.reply(`No tag "${tagName}" -> "${subtagName}" found.`);
        return;
    }
    const row = res.rows[0];
    const data = JSON.parse(await fs.readFile(row.file_path, 'utf-8'));
    const entry = data[subtagName];
    await message.reply({
        content: `**${row.tag_name} - ${row.subtag_name}**\n${entry.content}\n\n[Original Message](${entry.messageLink})`,
    });
}
