import { emojis } from "../../../config/config.js";
import { core } from "../../../core/Core.js";
import type { TagTable } from "../../../db/entities/Tag.js";
import { PermLevel } from "../../../db/entities/UserHost.js";
import { TagNotFoundError } from "../../../errors/client/404.js";
import { ensureStrictPositive } from "../../../utils/numbers/positive.js";
import { CommandDef, CommandInstance } from "../../Command.js";

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
                        { name: "tag-name", required: true, parseResultKey: "subcommand" },
                        { name: "alias-name", required: true, parseResultKey: "args" },
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

    protected async reply(): Promise<void> {
        await this.context.message.reply(
            `Aliased \`${this.tagName}\` as \`${this.aliasName}\` ${emojis.CHECKMARK}`,
        );
    }

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
