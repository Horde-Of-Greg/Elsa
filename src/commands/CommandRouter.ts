import { Message } from 'discord.js';
import { CommandDef, CommandInstance } from './Command';
import { commands } from './Commands';
import { config } from '../config/config';
import { app } from '../core/App';
import { CommandContext } from './types';

export class CommandRouter {
    private commandList: CommandDef<CommandInstance>[];
    private hashMap: Map<string, CommandDef<CommandInstance>>;

    constructor() {
        this.commandList = commands.getAll();
        this.hashMap = new Map();
        this.buildHashMap();
    }

    async route(context: CommandContext): Promise<void> {
        const commandId = this.getCommandId(context.message);
        if (!commandId) return;

        const commandDef = this.hashMap.get(commandId);
        if (!commandDef) return;

        const parseResult = commandDef.parse(context.message);
        if (!parseResult) return;

        const instance = commandDef.createInstance(context, parseResult);

        await instance.run();
    }

    static isCommand(commandCandidate: string) {
        const regex = new RegExp(`^${config.PREFIX}`);
        return regex.test(commandCandidate.trim());
    }

    private buildHashMap() {
        for (const command of this.commandList) {
            const aliases = command.getIdentifiers();
            for (const alias of aliases) {
                this.hashMap.set(alias, command);
            }
        }
    }

    private getCommandId(message: Message) {
        const pattern = `^${config.PREFIX}([a-z0-9]+)`;
        const regex = new RegExp(pattern, 'i');
        const match = message.content.match(regex);
        if (!match) return null;
        return match[1];
    }
}
