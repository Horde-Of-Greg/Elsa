import { EmbedBuilder } from "discord.js";
import { env } from "../../../config/config";
import { TagNotFoundError } from "../../../core/errors/client/404";
import { PermLevel } from "../../../db/entities/UserHost";
import { CommandDef, CommandInstance } from "../../Command";
import { app } from "../../../core/App";
import type { TagTable } from "../../../db/entities/Tag";

export class CommandTagDef extends CommandDef<CommandTagInstance> {
    constructor() {
        super(
            {
                name: "tag",
                aliases: ["t"],
                permLevelRequired: PermLevel.DEFAULT,
                cooldowns: {
                    channel: "disabled",
                    guild: "disabled",
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
        );
    }
}

class CommandTagInstance extends CommandInstance {
    private tag!: TagTable;
    private tagName!: string;
    private tagArgs?: string[];

    protected async validateData(): Promise<void> {
        this.tagName = this.arg<string>("tag-name");
        this.tagArgs = this.arg<string[]>("tag-args");
    }
    protected async execute(): Promise<void> {
        const tag = await this.tagService.findTag(this.tagName);
        if (!tag) {
            throw new TagNotFoundError(this.tagName);
        }
        this.tag = tag;
    }
    protected async reply(): Promise<void> {
        if (env.ENVIRONMENT === "production") {
            await this.context.message.reply(this.tag.body);
        } else {
            await this.context.message.reply({ embeds: [this.debugEmbed] });
        }
    }
    protected logExecution(): void {
        app.core.logger.simpleLog("debug", `Sent tag ${this.tag.name}`);
    }

    private get debugEmbed(): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle("Tag Run Info")
            .addFields(
                {
                    name: "Name",
                    value: this.tag.name,
                },
                {
                    name: "Content",
                    value: this.tag.body,
                },
                {
                    name: "Owner Info",
                    value: `id_db: ${this.tag.author.id}
                discordId: ${this.tag.author.discordId}
                name: ${this.tag.author.name}`,
                },
            )
            .setFooter({
                text: `took: ${app.core.queryTimer(this.timerKey).getTime().formatted} | debug: true`,
            });
    }
}
