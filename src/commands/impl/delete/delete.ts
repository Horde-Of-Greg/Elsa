import { Emojis } from "../../../assets/emojis";
import { core } from "../../../core/Core";
import type { TagTable } from "../../../db/entities/Tag";
import { PermLevel } from "../../../db/entities/UserHost";
import { NotOwnerError } from "../../../errors/client/403";
import { TagNotFoundError } from "../../../errors/client/404";
import { CommandDef, CommandInstance } from "../../Command";

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
                    arguments: [{ name: "tag-name", required: true, parseResultKey: "subcommand" }],
                },
            },
            CommandDeleteInstance,
            {
                useCache: false,
            },
        );
    }
}

export class CommandDeleteInstance extends CommandInstance<void> {
    private tagName!: string;
    private tag!: TagTable;

    protected async validateData(): Promise<void> {
        this.tagName = this.arg<string>("tag-name");

        await this.ensureTagNameExists();
        await this.ensureOwner();
    }

    protected async execute(): Promise<void> {
        await this.tagService.deleteTag(undefined, this.tag);
    }

    protected async reply(): Promise<void> {
        //TODO: add a way to revert a delete
        await this.context.message.reply(`${Emojis.CHECKMARK} Tag **${this.tagName}** deleted successfully!`);
    }

    protected logExecution(): void {
        core.logger.debug(`User ${this.context.author.username} deleted tag ${this.tagName}`);
    }

    private async ensureTagNameExists() {
        const tag = await this.tagService.findTagStrict(this.tagName);
        if (!tag) {
            throw new TagNotFoundError(this.tagName, true);
        }
        this.tag = tag;
    }

    private async ensureOwner() {
        const user = await this.userService.findOrCreateUser(this.context.author);
        if (this.tag.author.discordId !== this.context.author.id) {
            throw new NotOwnerError(this.tag.author, user, this.tag);
        }
    }
}
