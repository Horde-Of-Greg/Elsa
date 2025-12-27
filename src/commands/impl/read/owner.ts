import { core } from "../../../core/Core";
import type { UserTable } from "../../../db/entities/User";
import { PermLevel } from "../../../db/entities/UserHost";
import { TagNotFoundError } from "../../../errors/client/404";
import { ensureStrictPositive } from "../../../utils/numbers/positive";
import { CommandDef, CommandInstance } from "../../Command";

export class CommandOwnerDef extends CommandDef<UserTable, CommandOwnerInstance> {
    constructor() {
        super(
            {
                name: "owner",
                aliases: ["own", "author", "auth"],
                permLevelRequired: PermLevel.DEFAULT,
                cooldowns: {
                    channel: -1,
                    guild: -1,
                },
                info: {
                    description: "Return the owner of a command",
                    arguments: [{ name: "tag-name", required: true, parseResultKey: "subcommand" }],
                },
            },
            CommandOwnerInstance,
            {
                useCache: true,
                clear: false,
                ttl_s: ensureStrictPositive(3600 * 3),
            },
        );
    }
}

export class CommandOwnerInstance extends CommandInstance<UserTable> {
    private tagName!: string;

    protected async validateData(): Promise<void> {
        this.tagName = this.arg<string>("tag-name");
    }

    protected async execute(): Promise<UserTable> {
        const tag = await this.tagService.findTag(this.tagName);
        if (!tag) {
            throw new TagNotFoundError(this.tagName, true);
        }
        return tag.author;
    }

    protected async reply(): Promise<void> {
        await this.context.message.reply(`Tag **${this.tagName}** is owned by <@${this.content.discordId}>`);
    }

    protected logExecution(): void {
        core.logger.debug(`You forgot to change the default values of ${this.params.name}`);
    }
}
