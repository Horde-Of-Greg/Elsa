import { CommandContext, CommandDef, CommandInstance, ParseResult } from '../Command';

export class CommandTagDef extends CommandDef<CommandTagInstance> {
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
