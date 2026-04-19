import type { Message } from "discord.js";

import { emojis } from "../../../config/config";
import { core } from "../../../core/Core";
import { PermLevel } from "../../../db/entities/UserHost";
import { CommandDef } from "../../Command";
import { TagHandlingCommandInstance } from "../../TagHandlingCommand";

export class CommandDeleteDef extends CommandDef<void, CommandDeleteInstance> {
    constructor() {
        super(
            {
                name: "delete",
                aliases: ["d", "remove"],
                permLevelRequired: PermLevel.DEFAULT,
                cooldowns: {
                    channel: -1,
                    guild: -1,
                },
                info: {
                    description: "Deletes one of your tags.",
                    arguments: [
                        {
                            name: "tag-name",
                            required: true,
                            parseResultKey: "subcommand",
                            description: "The name of the tag you wish to delete. You must own this tag.",
                        },
                    ],
                },
            },
            CommandDeleteInstance,
            {
                useCache: false,
            },
        );
    }
}

export class CommandDeleteInstance extends TagHandlingCommandInstance<void> {
    protected async validateData(): Promise<void> {
        this.tagName = this.arg<string>("tag-name");

        await this.ensureTagNameExists();
        await this.ensureOwner();
    }

    protected async execute(): Promise<void> {
        await this.tagService.deleteTag(undefined, this.tag);
    }

    protected async reply(): Promise<Message> {
        //TODO: add a way to revert a delete
        return this.context.message.reply(
            `Tag **${this.tagName}** deleted successfully! ${emojis.CHECKMARK}`,
        );
    }

    protected async postReply(sentMessage: Message): Promise<void> {}

    protected logExecution(): void {
        core.logger.debug(`User ${this.context.author.username} deleted tag ${this.tagName}`);
    }
}
