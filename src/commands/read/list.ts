import { PermLevel } from '../../db/entities/UserHost';
import { CommandDef, CommandInstance } from '../Command';

export class CommandListDef extends CommandDef<CommandListInstance> {
    constructor() {
        super(
            {
                name: 'list',
                aliases: ['l', 'li'],
                permLevelRequired: PermLevel.DEFAULT,
                cooldown_s: -1,
            },
            CommandListInstance,
        );
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
