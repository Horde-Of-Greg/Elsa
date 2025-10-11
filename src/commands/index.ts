import { Message } from 'discord.js';
import { ParsedMessage } from '../utils/parser';
import assert from 'assert';
import { AppDataSource } from '../db/dataSource';
import { HostTable } from '../db/entities/Host';
import { UserTable } from '../db/entities/User';
import { PermHandler } from '../handlers/PermHandler';
import { addTag } from './addtag';
import { UserHostTable } from '../db/entities/UserHost';
import { findDcIdByUsername } from '../utils/discordIdUtil';
import { getCommandName, getRankEnum } from '../utils/commandUtil';
import { setRank } from './setrank';
import { executeTag } from './tag';
import { DbHandler, getDbHandler } from '../handlers/DbHandler';

//TODO: class?
export async function handleCommand(message: Message, parsedMessage: ParsedMessage) {
    const dbHandler = getDbHandler();

    const user = await dbHandler.findOrCreateUser(message.author.id);
    //TODO: Impl a way to override the host with the parsedMessage.server
    const host = await hostRepo.findOneBy({
        discordId: message.guildId ? message.guildId : '0',
    });
    assert(host, 'Host Not Found. Hosts need to be explicitely created.');

    const userHost = await userHostRepo.findOneBy({
        user: user,
        host: host,
    });
    assert(userHost, 'No User Host Found');

    const permHandler = new PermHandler();

    const commandName = getCommandName(parsedMessage.command);
    assert(commandName, 'No Command Name Found');

    const args: Array<string> | null = parsedMessage.args;
    assert(args, 'No Args Found');

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
                message.reply(`Could not find user: ${targetUserName}.`);
                return;
            }
            const targetRankLvl: string = args[1];
            const targetRank = getRankEnum(targetRankLvl);
            if (!targetRank) {
                message.reply(`Could not find rank: ${targetRankLvl}`);
                return;
            }

            const targetUser = await userRepo.findOneBy({
                discordId: targetUserId,
            });
            assert(targetUser, 'No Target User Found');

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
                message.reply('Args not yet implemented. Run the command again without args.');
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
