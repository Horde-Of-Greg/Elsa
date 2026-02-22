import { EmbedBuilder } from "discord.js";

import { core } from "../../../core/Core.js";
import { PermLevel } from "../../../db/entities/UserHost.js";
import { TagNotFoundError } from "../../../errors/client/404.js";
import { isProductionEnvironment } from "../../../utils/node/environment.js";
import { ensureStrictPositive } from "../../../utils/numbers/positive.js";
import { CommandDef, CommandInstance } from "../../Command.js";

type tagReplyElements = {
    name: string;
    body: string;
    authorId_db: string;
    authorId_dc: string;
    authorName: string;
};

export class CommandTagDef extends CommandDef<tagReplyElements, CommandTagInstance> {
    constructor() {
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
                        { name: "tag-name", required: true, parseResultKey: "subcommand" },
                        { name: "tag-args", required: false, parseResultKey: "args" },
                    ],
                },
            },
            CommandTagInstance,
            {
                useCache: true,
                clear: true,
                ttl_s: ensureStrictPositive(3600 * 3),
            },
        );
    }
}

class CommandTagInstance extends CommandInstance<tagReplyElements> {
    private tagName!: string;
    private tagArgs?: string[];

    protected async validateData(): Promise<void> {
        this.tagName = this.arg<string>("tag-name");
        this.tagArgs = this.arg<string[]>("tag-args");
    }
    protected async execute(): Promise<tagReplyElements> {
        const tag = await this.tagService.findTag(this.tagName);
        if (!tag) {
            throw new TagNotFoundError(this.tagName, false);
        }
        return {
            name: tag.name,
            body: tag.body,
            authorId_db: tag.author.id.toString(),
            authorId_dc: tag.author.discordId,
            authorName: tag.author.name ?? "unknown",
        };
    }
    protected async reply(): Promise<void> {
        if (isProductionEnvironment()) {
            await this.context.message.reply(this.content.body);
        } else {
            await this.context.message.reply({ embeds: [this.debugEmbed()] });
        }
    }
    protected logExecution(): void {
        core.logger.debug(`Sent tag ${this.content.name}`);
    }

    private debugEmbed(): EmbedBuilder {
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
                text: `took: ${core.queryTimer(this.timerKey).getTime().formatted} | debug: true`,
            });
    }
}
