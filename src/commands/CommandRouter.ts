import { BaseCommand, CommandContext } from './BaseCommand';
import { commands } from './Commands';

export class CommandRouter {
    private commandList: BaseCommand[];

    constructor() {
        this.commandList = commands.getAll();
    }

    async main(context: CommandContext): Promise<void> {
        for (const command of this.commandList) {
            if (!command.match(context)) {
                continue;
            }

            const parseResult = command.parse(context);

            if (!parseResult) {
                continue;
            }

            await command.run(context, parseResult);

            return;
        }
    }
}
