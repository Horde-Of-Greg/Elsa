import { PermLevel } from '../../db/entities/UserHost';
import { CommandContext, CommandDef, CommandInstance, ParseResult } from '../Command';
import { CommandTagDef } from './tag';

export class CommandListDef extends CommandDef<CommandListInstance> {
    constructor() {
        super({
            name: 'list',
            aliases: ['l', 'li'],
            permLevelRequired: PermLevel.DEFAULT,
            cooldown_s: -1,
        });
    }

    createInstance(context: CommandContext, parseResult: ParseResult): CommandListInstance {
        return new CommandListInstance(context, parseResult, this.params);
    }
}

class CommandListInstance extends CommandInstance {
    protected async validateArguments(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    protected execute(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    protected reply(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    protected logExecution(): void {}
}
