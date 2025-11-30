import { Message } from 'discord.js';
import { ParsedMessage } from '../utils/parsing/parser';
import assert from 'assert';
import { AppDataSource } from '../db/dataSource';
import { HostTable } from '../db/entities/Host';
import { UserTable } from '../db/entities/User';
import { PermHandler } from '../handlers/PermHandler';
import { addTag } from './addtag';
import { UserHostTable } from '../db/entities/UserHost';
import { findDcIdByUsername } from '../discord/utils/discordId';
import { getCommandName, getRankEnum } from '../discord/commandHelper';
import { setRank } from './setrank';
import { executeTag } from './tag';
import { DbHandler, getDbHandler } from '../handlers/DbHandler';

//TODO: class?
export async function handleCommand(message: Message, parsedMessage: ParsedMessage) {
    const dbHandler = getDbHandler();
    const permHandler = new PermHandler();

    //TODO: Impl a way to override the host with the parsedMessage.server
    const userAndHost = await dbHandler.findUserAndHost(message.author.id, message.guildId);
    if (!userAndHost) {
        await message.reply('Error during fetching server');
        return;
    }
    const { user, host, userHost } = userAndHost;

    const commandName = getCommandName(parsedMessage.command);
    if (!commandName) {
        await message.reply('Error during fetching command name');
        return;
    }

    const args = parsedMessage.args;
    if (!args) {
        await message.reply('Error during fetching args');
        return;
    }

    switch (commandName) {
        case 'add':
            // format: <prefix>add<<->server-optional> <tagName> <body>
            if (!permHandler.userCanCreateTags(user, host)) {
                await message.reply('higher rank required.');
                return;
            }

            const tagName: string = args[0];
            const tagBody: string = args.splice(1).join('');

            try {
                await addTag(tagName, tagBody, user, host, message);
            } catch (e: any) {
                await message.reply(e.message ? e.message : 'Unknown error.');
            }
            break;

        case 'setRank':
            // format: <prefix>setrank<<->server-optional> <targetUserName> <targetRankLvl>
            const targetUserName: string = args[0];
            const targetUserId: string | null = await findDcIdByUsername(targetUserName);
            //TODO: Handle ID and Display Name
            if (!targetUserId) {
                await message.reply(`Could not find user: ${targetUserName}.`);
                return;
            }

            const targetRankLvl: string = args[1];
            const targetRank = getRankEnum(targetRankLvl);
            if (!targetRank) {
                await message.reply(`Could not find rank: ${targetRankLvl}`);
                return;
            }

            const targetUser = await dbHandler.findOrCreateUser(targetUserId);
            if (!permHandler.userCanSetRanks(user, host, targetUser, targetRank)) {
                await message.reply('you do not have the permissions to do this.');
                return;
            }

            try {
                await setRank(targetUser, targetRank);

                await message.reply(
                    `Rank of ${targetUserName} successfully updated to ${targetRankLvl}`,
                );
            } catch (e: any) {
                await message.reply(e.message ? e.message : 'Unknown error.');
            }

            break;
        case 'sendTag':
            // format: <prefix>tag<<->server-optional> <tag> <args>
            const tagToRun = args[0];
            const argsForTag = args.splice(1);
            if (argsForTag) {
                await message.reply(
                    'Args not yet implemented. Run the command again without args.',
                );
                return;
            }

            if (!permHandler.userCanUseTags(user, host)) {
                await message.reply('you do not have the permissions to execute tags.');
                return;
            }

            try {
                await executeTag(tagToRun, host, message);
            } catch (e: any) {
                await message.reply(e.message ? e.message : 'Unknown error.');
            }

            break;
    }
}
