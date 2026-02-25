import type { Message } from "discord.js";

import { emojis } from "../../../config/config";
import { core } from "../../../core/Core";
import type { TagTable } from "../../../db/entities/Tag";
import { PermLevel } from "../../../db/entities/UserHost";
import { TagNotFoundError } from "../../../errors/client/404";
import { ensureStrictPositive } from "../../../utils/numbers/positive";
import { CommandDef, CommandInstance } from "../../Command";

export class CommandAliasDef extends CommandDef<void, CommandAliasInstance> {
    constructor() {
        super(
            {
                name: "alias",
                aliases: ["al"],
                permLevelRequired: PermLevel.DEFAULT,
                cooldowns: {
                    channel: ensureStrictPositive(5),
                    guild: ensureStrictPositive(5),
                },
                info: {
                    description:
                        "Adds an alias to a command. Aliases are alternative names that call a command.",
                    arguments: [
                        {
                            name: "tag-name",
                            required: true,
                            parseResultKey: "subcommand",
                            description:
                                "The name of the tag you wish to give a new alias to. You do not need to own this tag.",
                        },
                        {
                            name: "alias-name",
                            required: true,
                            parseResultKey: "args",
                            description:
                                "The name of the alias. This name must be unique, it cannot be the name of an existing tag. It must also be useful as this is how people will call, and search for your tag.",
                        },
                    ],
                },
            },
            CommandAliasInstance,
            {
                useCache: false,
            },
        );
    }
}

export class CommandAliasInstance extends CommandInstance<void> {
    private aliasName!: string;
    private tagName!: string;
    private tag!: TagTable;

    protected async validateData(): Promise<void> {
        this.tagName = this.arg<string>("tag-name");
        this.aliasName = this.arg<string[]>("alias-name")[0];

        await this.ensureTagNameExists();
    }

    protected async execute(): Promise<void> {
        const author = await this.userService.findOrCreateUser(this.context.author);
        await this.tagService.createAlias(this.aliasName, { tagToAlias: this.tag, type: "object" }, author);
    }

    protected async reply(): Promise<Message> {
        return this.context.message.reply(
            `Aliased \`${this.tagName}\` as \`${this.aliasName}\` ${emojis.CHECKMARK}`,
        );
    }

    protected async postReply(sentMessage: Message): Promise<void> {}

    protected logExecution(): void {
        core.logger.info(
            `User ${this.context.author.username} created alias ${this.aliasName} to tag ${this.tagName}`,
        );
    }

    private async ensureTagNameExists() {
        const tag = await this.tagService.findTagStrict(this.tagName);
        if (!tag) {
            throw new TagNotFoundError(this.tagName, true);
        }
        this.tag = tag;
    }
}
