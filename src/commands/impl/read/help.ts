import { type APIEmbedField, EmbedBuilder, type MessageReplyOptions } from "discord.js";

import { EmbedColors } from "../../../assets/colors/colors";
import { appConfig } from "../../../config/config";
import { core } from "../../../core/Core";
import { PermLevel } from "../../../db/entities/UserHost";
import { ensureStrictPositive } from "../../../utils/numbers/positive";
import { CommandDef, CommandInstance } from "../../Command";
import { commands } from "../../Commands";

export class CommandHelpDef extends CommandDef<MessageReplyOptions, CommandHelpInstance> {
    constructor() {
        super(
            {
                name: "help",
                aliases: ["h", "info"],
                permLevelRequired: PermLevel.DEFAULT,
                cooldowns: {
                    channel: -1,
                    guild: -1,
                },
                info: {
                    description: "Sends this command.",
                },
            },
            CommandHelpInstance,
            {
                useCache: true,
                clear: true,
                ttl_s: ensureStrictPositive(3600 * 24),
            },
        );
    }
}

export class CommandHelpInstance extends CommandInstance<MessageReplyOptions> {
    private commandDefs = commands.getAll();
    private message: APIEmbedField[] = [];

    protected async validateData(): Promise<void> {}

    protected async execute(): Promise<MessageReplyOptions> {
        for (const commandDef of this.commandDefs) {
            const params = commandDef.getParams();

            const args: string[] = [];
            params.info.arguments?.forEach((argument) => {
                args.push(`<${argument.required ? "required" : "optional"}: ${argument.name}>`);
            });

            this.message.push({
                name: `\`${params.name}\``,
                // prettier-ignore
                value: `Usage: \`${appConfig.PREFIX}${[params.name].concat(params.aliases).join('|')} ${args.join(" ")}\`
                Description: ${params.info.description}`,
            });
        }

        const embed = new EmbedBuilder()
            .setTitle("Commands Usage")
            .setColor(EmbedColors.CYAN)
            .setFields(this.message);

        return { embeds: [embed] };
    }
    protected async reply(): Promise<void> {
        await this.context.message.reply(this.content);
    }
    protected logExecution(): void {
        core.logger.debug(`Sent command ${this.params.name}`);
    }
}
