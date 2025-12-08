import { CommandContext, CommandDef, CommandInstance, ParseResult } from '../Command';

export class CommandListDef extends CommandDef<CommandListInstance> {
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
