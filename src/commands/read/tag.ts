import { PermLevel } from '../../db/entities/UserHost';
import { CommandDef, CommandInstance } from '../Command';

export class CommandTagDef extends CommandDef<CommandTagInstance> {
    constructor() {
        super(
            {
                name: 'tag',
                aliases: ['t'],
                permLevelRequired: PermLevel.DEFAULT,
                cooldown_s: -1,
            },
            CommandTagInstance,
        );
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
