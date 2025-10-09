import { Message } from 'discord.js';
import { config } from '../config/config';
export async function setRank(message: Message, args: string[]): Promise<void> {
    if (!(await hasRank(message.member!, config.cmdMinRank.setrank))) {
        await message.reply('Super-admin+ only.');
        return;
    }
    if (args.length < 2) {
        await message.reply('Usage: !px setrank @User 0-5');
        return;
    }
    const target = args[0].replace(/[<@!>]/g, '');
    const rank = parseInt(args[1], 10);
    if (isNaN(rank) || rank < 0 || rank > 5) {
        await message.reply('Rank must be 0-5.');
        return;
    }

    await query(
        `INSERT INTO ranks (user_id, rank) VALUES ($1,$2)
     ON CONFLICT (user_id) DO UPDATE SET rank=$2`,
        [target, rank],
    );
    await message.reply(`<@${target}> now ${RANKS[rank]}.`);
}
