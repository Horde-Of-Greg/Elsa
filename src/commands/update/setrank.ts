import { PermLevel } from '../../db/entities/UserHost';
import { CommandDef, CommandInstance } from '../Command';

export class CommandSetRankDef extends CommandDef<CommandSetRankInstance> {
    constructor() {
        super(
            {
                name: 'setrank',
                aliases: ['sr', 'srank'],
                permLevelRequired: PermLevel.OWNER,
                cooldown_s: -1,
            },
            CommandSetRankInstance,
        );
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
