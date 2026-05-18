import { EmbedBuilder, type Message } from "discord.js";

import { PermLevel } from "../../../assets/db/permLevel";
import { TagNotFoundError } from "../../../errors/client/404";
import type { CommandTagReplyElements } from "../../../types/commands/tag";
import type { DependenciesResolver } from "../../../types/core/dependencies";
import { isProductionEnvironment } from "../../../utils/node/environment";
import { ensureStrictPositive } from "../../../utils/numbers/positive";
import { CommandDef, CommandInstance } from "../../Command";
import type { Commands } from "../../Commands";

export class CommandTagDef extends CommandDef<CommandTagReplyElements, CommandTagInstance> {
    constructor(dependencies: DependenciesResolver, commands: Commands) {
        super(
            {
                name: "tag",
                aliases: ["t"],
                permLevelRequired: PermLevel.DEFAULT,
                cooldowns: {
                    channel: -1,
                    guild: -1,
                },
                info: {
                    description: "Return the body of a tag stored in the database.",
                    arguments: [
                        {
                            name: "tag-name",
                            required: true,
                            parseResultKey: "subcommand",
                            description: "The tag you wish to call.",
                        },
                        {
                            name: "tag-args",
                            required: false,
                            parseResultKey: "args",
                            description:
                                "The arguments you wish to pass to the tag. If the tag is not a script, this does nothing. They are passed as a string array, split by spaces.",
                        },
                    ],
                },
            },
            CommandTagInstance,
            {
                useCache: true,
                clear: true,
                ttl_s: ensureStrictPositive(3600 * 3),
            },
            dependencies,
            commands,
        );
    }
}

class CommandTagInstance extends CommandInstance<CommandTagReplyElements> {
    private tagName!: string;
    // eslint-disable-next-line @typescript-eslint/no-unused-private-class-members
    private tagArgs?: string[];

    protected async validateData(): Promise<void> {
        this.tagName = this.arg<string>("tag-name");
        this.tagArgs = this.arg<string[]>("tag-args");
    }
    protected async execute(): Promise<CommandTagReplyElements> {
        const tag = await this.tagService.findTag(this.tagName);
        if (!tag) {
            throw new TagNotFoundError(this.tagName, false, this.dependencies.configs);
        }
        return {
            name: tag.name,
            body: tag.body,
            authorId_db: tag.author.id.toString(),
            authorId_dc: tag.author.discordId,
            authorName: tag.author.name ?? "unknown",
        };
    }
    protected async reply(): Promise<Message> {
        if (isProductionEnvironment()) {
            return this.context.message.reply(this.content.body);
        } else {
            return this.context.message.reply({ embeds: [this.debugEmbed] });
        }
    }

    protected async postReply(sentMessage: Message): Promise<void> {}

    protected logExecution(): void {
        this.dependencies.logger.debug(`Sent tag ${this.content.name}`);
    }

    private get debugEmbed(): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle("Tag Run Info")
            .addFields(
                {
                    name: "Name",
                    value: this.content.name,
                },
                {
                    name: "Content",
                    value: this.content.body,
                },
                {
                    name: "Owner Info",
                    value: `id_db: ${this.content.authorId_db}
                discordId: ${this.content.authorId_dc}
                name: ${this.content.authorName}`,
                },
            )
            .setFooter({
                text: `took: ${this.dependencies.timers.queryTimer(this.timerKey).getTime().formatted} | debug: true`,
            });
    }
}
