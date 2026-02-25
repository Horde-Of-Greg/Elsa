import { type APIEmbedField, EmbedBuilder, type Message, type MessageReplyOptions } from "discord.js";

import { EmbedColors, HogColors } from "../../../assets/colors/colors";
import { appConfig } from "../../../config/config";
import { core } from "../../../core/Core";
import { PermLevel } from "../../../db/entities/UserHost";
import { BadArgumentError } from "../../../errors/client/400";
import { ensureStrictPositive } from "../../../utils/numbers/positive";
import { CommandDef, CommandInstance } from "../../Command";
import { commands } from "../../Commands";

export class CommandHelpDef extends CommandDef<MessageReplyOptions, CommandHelpInstance> {
    constructor() {
        super(
            {
                name: "help",
                aliases: ["h", "info", "i", "man"],
                permLevelRequired: PermLevel.DEFAULT,
                cooldowns: {
                    channel: -1,
                    guild: -1,
                },
                info: {
                    description:
                        "Sends this command if called with no arguments. Sends the usage information for a single command if called with an argument.",
                    arguments: [
                        {
                            name: "command-name",
                            required: false,
                            parseResultKey: "subcommand",
                            description: "The command you wish to know the usage information of",
                        },
                    ],
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
    private readonly commandDefs = commands.allCommands;
    private readonly message: APIEmbedField[] = [];
    private command: string | null;

    protected async validateData(): Promise<void> {
        this.command = this.arg<string | null>("command-name");
    }

    protected async execute(): Promise<MessageReplyOptions> {
        if (this.command === null) {
            return this.replyGlobalHelp();
        }

        const commandDef = this.commandMap.get(this.command.toLowerCase());
        if (!commandDef) {
            throw new BadArgumentError(
                "command-name",
                Array.from(this.commandMap.keys()),
                this.command,
                false,
            );
        }
        return this.replyCommandHelp(commandDef);
    }

    protected async reply(): Promise<Message> {
        return this.context.message.reply(this.content);
    }

    protected async postReply(sentMessage: Message): Promise<void> {}

    protected logExecution(): void {
        core.logger.debug(`Sent command ${this.params.name}`);
    }

    private replyGlobalHelp() {
        for (const commandDef of this.commandDefs) {
            const params = commandDef.getParams();
            if (params.permLevelRequired > PermLevel.TRUSTED || (params.hideFromHelp ?? false)) continue;

            const args: string[] = [];
            params.info.arguments?.forEach((argument) => {
                args.push(`<${argument.required ? "required" : "optional"}: ${argument.name}>`);
            });

            this.message.push({
                name: `\`${params.name}\``,
                // prettier-ignore
                value: `Usage: \`${appConfig.PREFIX}${[params.name].concat(params.aliases).join('|')} ${args.join(" ")}\`
Description: ${params.info.description}
Perm Level Required: ${PermLevel[params.permLevelRequired]}`,
            });
        }

        const embed = new EmbedBuilder()
            .setTitle("Commands Usage")
            .setColor(EmbedColors.CYAN)
            .setFields(this.message);

        return { embeds: [embed] };
    }

    private replyCommandHelp(commandDef: CommandDef<unknown, CommandInstance<unknown>>) {
        const params = commandDef.getParams();

        const capitalizedName = params.name.charAt(0).toUpperCase() + params.name.slice(1);
        const formattedGuildName = this.context.message.guild?.name ?? "This Guild";
        const formattedGuildCdName = params.cooldowns.guild > 0 ? `${params.cooldowns.guild}s` : "none";
        const formattedChannelCdName = params.cooldowns.channel > 0 ? `${params.cooldowns.channel}s` : "none";

        const formattedAliases = params.aliases.map((alias) => `- ${alias}`).join("\n");
        const formattedArgsNoDesc =
            params.info.arguments
                ?.map((arg) => ` <${arg.name.replaceAll("-", "_").toUpperCase()}>`)
                .join("") ?? "";
        const formattedArgsWithDesc = params.info.arguments
            ?.map((arg) => {
                const formattedArgName = arg.name.replaceAll("-", "_").toUpperCase();
                const optionality = arg.required ? "required" : "optional";

                return `- ${formattedArgName}(\`${optionality}\`): ${arg.description}`;
            })
            .join("\n");

        const formattedCooldown =
            `- ${formattedGuildName}: ${formattedGuildCdName}` +
            "\n" +
            `- This channel: ${formattedChannelCdName}`;

        let color: HogColors;
        switch (params.permLevelRequired) {
            case PermLevel.DEFAULT:
                color = HogColors.WHITE;
                break;

            case PermLevel.TRUSTED:
                color = HogColors.GREEN;
                break;

            case PermLevel.MOD:
                color = HogColors.PURPLE;
                break;

            case PermLevel.ADMIN:
                color = HogColors.RED_0;
                break;

            case PermLevel.OWNER:
                color = HogColors.RED_1;
                break;
        }

        const embed = new EmbedBuilder()
            .setTitle(`Command \`${capitalizedName}\` Usage Information`)
            .setDescription(
                `Usage: \`${appConfig.PREFIX}${[params.name].concat(params.aliases).join("|")}${formattedArgsNoDesc}\``,
            )
            .setFields(
                { name: "__Valid Aliases__", value: formattedAliases },
                { name: "__Rank Required__", value: "`" + PermLevel[params.permLevelRequired] + "`" },
                {
                    name: "__Valid arguments__",
                    value: formattedArgsWithDesc ?? "This command requires no arguments",
                },
                { name: "__Cooldowns__", value: formattedCooldown },
            )
            .setColor(color);

        return { embeds: [embed] };
    }
}
