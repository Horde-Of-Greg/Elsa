import { Message } from 'discord.js';
import { ParsedMessage } from '../utils/parser';
import assert from 'assert';
import { AppDataSource } from '../db/dataSource';
import { HostTable } from '../db/entities/Host';
import { UserTable } from '../db/entities/User';
import { PermHandler } from '../handlers/PermHandler';
import { addTag } from './addtag';

//TODO: class?
async function handleCommand(message: Message, parsedMessage: ParsedMessage) {
    const userRepo = AppDataSource.getRepository(UserTable);
    const hostRepo = AppDataSource.getRepository(HostTable);

    const user = await userRepo.findOneBy({
        discordId: message.member?.id,
    });
    //TODO: Impl a way to override the host with the parsedMessage.server
    const host = await hostRepo.findOneBy({
        discordId: message.id,
    });

    assert(host, 'No Host Found');
    assert(user, 'User Not Found');

    const permHandler = new PermHandler();

    const commandName = getCommandName(parsedMessage.command);
    assert(commandName, 'No Command Name Found');

    switch (commandName) {
        case 'add':
            if (!permHandler.userCanCreateTags(user, host)) {
                await message.reply('higher rank required.');
                return;
            }
            const args = parsedMessage.args;
            assert(args, 'No Args Found');
            addTag(args[0], args.splice(1).join(''), message, host, user);
    }
}
