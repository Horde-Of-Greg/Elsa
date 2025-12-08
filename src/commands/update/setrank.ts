import { CommandContext, CommandDef, CommandInstance, ParseResult } from '../Command';

export class CommandSetRankDef extends CommandDef<CommandSetRankInstance> {
    createInstance(context: CommandContext, parseResult: ParseResult): CommandSetRankInstance {
        return new CommandSetRankInstance(context, parseResult, this.params);
    }
}

class CommandSetRankInstance extends CommandInstance {
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
