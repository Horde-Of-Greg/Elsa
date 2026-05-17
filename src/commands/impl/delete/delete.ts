import type { Message } from "discord.js";

import { PermLevel } from "../../../assets/db/permLevel";
import type { DependenciesResolver } from "../../../types/core/dependencies";
import { CommandDef } from "../../Command";
import type { Commands } from "../../Commands";
import { TagHandlingCommandInstance } from "../../TagHandlingCommand";

export class CommandDeleteDef extends CommandDef<void, CommandDeleteInstance> {
    constructor(dependencies: DependenciesResolver, commands: Commands) {
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
            dependencies,
            commands,
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
        return this.context.message.reply(
            `Tag **${this.tagName}** deleted successfully! ${this.dependencies.configs.emoji.CHECKMARK}.` +
                `\nYou have  minutes to undo this action with \`${this.dependencies.configs.app.PREFIX} undelete ${this.tagName}\``,
        );
    }

    protected async postReply(sentMessage: Message): Promise<void> {}

    protected logExecution(): void {
        this.dependencies.logger.debug(`User ${this.context.author.username} deleted tag ${this.tagName}`);
    }
}
