import type { Message } from "discord.js";

import { core } from "../../../core/Core";
import { dependencies } from "../../../core/Dependencies";
import { PermLevel } from "../../../db/entities/UserHost";
import { CommandDef } from "../../Command";
import { TagHandlingCommandInstance } from "../../TagHandlingCommand";

export class CommandUndeleteDef extends CommandDef<void, CommandUndeleteInstance> {
    constructor() {
        super(
            {
                name: "undelete",
                aliases: ["udel", "udl"],
                permLevelRequired: PermLevel.DEFAULT,
                cooldowns: {
                    channel: -1,
                    guild: -1,
                },
                info: {
                    description: `Tries to retrieve one of your recently deleted tags. Only checks for tags in the past ${dependencies.formatter.app.formattedDelay}`,
                    arguments: [
                        {
                            name: "tag-name",
                            required: true,
                            parseResultKey: "subcommand",
                            description: "The name of the tag you wish to retrieve. You must own this tag.",
                        },
                    ],
                },
            },
            CommandUndeleteInstance,
            {
                useCache: false,
            },
        );
    }
}

export class CommandUndeleteInstance extends TagHandlingCommandInstance<void> {
    protected async validateData(): Promise<void> {
        this.tagName = this.arg<string>("tag-name");

        this.tag = await this.tagService.retrieveTag(this.tagName);
        await this.ensureOwner();
    }

    protected async execute(): Promise<void> {
        await this.tagService.createTag({
            tagName: this.tag.name,
            tagBody: this.tag.body,
            tagBodyHash: this.tag.bodyHash,
            author: this.context.author,
            guild: this.context.guild,
        });
    }

    protected async reply(): Promise<Message> {
        return this.context.message.reply(
            `Tag **${this.tagName}** retrieved successfully! ${dependencies.config.emoji.CHECKMARK}.`,
        );
    }

    protected async postReply(sentMessage: Message): Promise<void> {}

    protected logExecution(): void {
        core.logger.info(`User ${this.context.author.tag} retrieved tag: ${this.tagName}`);
    }
}
