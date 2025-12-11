import { EmbedBuilder, type APIEmbedField } from 'discord.js';
import { app } from '../../../core/App';
import { PermLevel } from '../../../db/entities/UserHost';
import { CommandDef, CommandInstance } from '../../Command';
import { commands } from '../../Commands';
import { config } from '../../../config/config';

export class CommandHelpDef extends CommandDef<CommandHelpInstance> {
    constructor() {
        super(
            {
                name: 'help',
                aliases: ['h', 'help', 'info'],
                permLevelRequired: PermLevel.DEFAULT,
                cooldowns: {
                    channel: -1,
                    guild: -1,
                },
                info: {
                    description: 'Sends this command.',
                },
            },
            CommandHelpInstance,
        );
    }
}

class CommandHelpInstance extends CommandInstance {
    private commandDefs = commands.getAll();
    private message: APIEmbedField[] = [];

    protected async validateData(): Promise<void> {}

    protected async execute(): Promise<void> {
        for (const commandDef of this.commandDefs) {
            const params = commandDef.getParams();

            const args: string[] = [];
            params.info.arguments?.forEach((argument) => {
                args.push(`<${argument.required ? 'required' : 'optional'}: ${argument.name}>`);
            });

            this.message.push({
                name: `\`${params.name}\``,
                // prettier-ignore
                value: `Usage: \`${config.PREFIX}${[params.name].concat(params.aliases).join('|')} ${args.join(" ")}\`
                Description: ${params.info.description}`,
            });
        }
    }
    protected async reply(): Promise<void> {
        const embed = new EmbedBuilder()
            .setTitle('Commands Usage')
            .setColor(0x00dbe2)
            .setFields(this.message);
        await this.context.message.reply({ embeds: [embed] });
    }
    protected logExecution(): void {
        app.core.logger.simpleLog('debug', `Sent command ${this.params.name}`);
    }
}
