import { PermLevel } from '../../db/entities/UserHost';
import { CommandContext, CommandDef, CommandInstance, ParseResult } from '../Command';
import { CommandSetRankDef } from '../update/setrank';

export class CommandTagDef extends CommandDef<CommandTagInstance> {
    constructor() {
        super({
            name: 'tag',
            aliases: ['t'],
            permLevelRequired: PermLevel.DEFAULT,
            cooldown_s: -1,
        });
    }

    createInstance(context: CommandContext, parseResult: ParseResult): CommandTagInstance {
        return new CommandTagInstance(context, parseResult, this.params);
    }
}

class CommandTagInstance extends CommandInstance {
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
