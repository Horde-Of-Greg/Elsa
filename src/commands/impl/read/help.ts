import {
    type APIEmbedField,
    EmbedBuilder,
    inlineCode,
    type Message,
    type MessageReplyOptions,
    underline,
} from "discord.js";

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
    private command: string | undefined;

    protected async validateData(): Promise<void> {
        this.command = this.arg<string | undefined>("command-name");
    }

    protected async execute(): Promise<MessageReplyOptions> {
        if (this.command === undefined) {
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
                name: inlineCode(params.name),
                // prettier-ignore
                value: `Usage: ${inlineCode(appConfig.PREFIX + [params.name].concat(params.aliases).join('|') + args.join(" "))}\n`
                     + `Description: ${params.info.description}\n`
                     + `Perm Level Required: ${inlineCode(PermLevel[params.permLevelRequired])}`,
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
        const formattedGuildCd = params.cooldowns.guild > 0 ? `${params.cooldowns.guild}s` : "none";
        const formattedChannelCd = params.cooldowns.channel > 0 ? `${params.cooldowns.channel}s` : "none";

        const inlineAliases = [params.name].concat(params.aliases).join("|");
        const aliasList = params.aliases.map((alias) => `- ${alias}`).join("\n");

        const inlineArgs =
            params.info.arguments
                ?.map((arg) => `<${arg.name.replaceAll("-", "_").toUpperCase()}>`)
                .join(" ") ?? "";

        const argList = params.info.arguments
            ?.map((arg) => {
                const argName = arg.name.replaceAll("-", "_").toUpperCase();
                const optionality = arg.required ? "required" : "optional";

                return `- ${argName}(${inlineCode(optionality)}): ${arg.description}`;
            })
            .join("\n");

        const formattedCooldown =
            `- ${formattedGuildName}: ${formattedGuildCd}` + "\n" + `- This channel: ${formattedChannelCd}`;

        const permLevelColorMap: Record<PermLevel, HogColors> = {
            [PermLevel.DEFAULT]: HogColors.WHITE,
            [PermLevel.TRUSTED]: HogColors.GREEN,
            [PermLevel.MOD]: HogColors.PURPLE,
            [PermLevel.ADMIN]: HogColors.RED_0,
            [PermLevel.OWNER]: HogColors.RED_1,
        };

        const embed = new EmbedBuilder()
            .setTitle(`Command \`${capitalizedName}\` Usage Information`)
            .setDescription(
                "Usage: " + inlineCode(`${appConfig.PREFIX}${inlineAliases} ${inlineArgs.trim()}`),
            )
            .setFields(
                { name: underline("Valid Aliases"), value: aliasList },
                { name: underline("Rank Required"), value: inlineCode(PermLevel[params.permLevelRequired]) },
                {
                    name: underline("Valid arguments"),
                    value: argList ?? "This command requires no arguments",
                },
                { name: underline("Cooldowns"), value: formattedCooldown },
            )
            .setColor(permLevelColorMap[params.permLevelRequired]);

        return { embeds: [embed] };
    }
}
