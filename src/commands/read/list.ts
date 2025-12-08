import { CommandContext, CommandDef, CommandInstance, ParseResult } from '../Command';
import { CommandAddInstance } from '../create/add';

export class CommandListDef extends CommandDef {
    createInstance(context: CommandContext, parseResult: ParseResult): CommandInstance {
        return new CommandAddInstance(context, parseResult, this.params);
    }
}

export class CommandListInstance extends CommandInstance {
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
