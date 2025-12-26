import { Emojis } from "../../../assets/emojis";
import { core } from "../../../core/Core";
import type { TagTable } from "../../../db/entities/Tag";
import { PermLevel } from "../../../db/entities/UserHost";
import { NotOwnerError } from "../../../errors/client/403";
import { TagNotFoundError } from "../../../errors/client/404";
import { TagBodyExistsError } from "../../../errors/client/409";
import type { SHA256Hash } from "../../../types/crypto";
import { ensureStrictPositive } from "../../../utils/numbers/positive";
import { CommandDef, CommandInstance } from "../../Command";
import { commands } from "../../Commands";

export class CommandEditDef extends CommandDef<void, CommandEditInstance> {
    constructor() {
        super(
            {
                name: "edit",
                aliases: ["e"],
                permLevelRequired: PermLevel.DEFAULT,
                cooldowns: {
                    channel: ensureStrictPositive(5),
                    guild: ensureStrictPositive(5),
                },
                info: {
                    description: "Edits the content of an existing tag",
                    arguments: [
                        { name: "tag-name", required: true, parseResultKey: "subcommand" },
                        { name: "new-tag-body", required: true, parseResultKey: "args" },
                    ],
                },
            },
            CommandEditInstance,
            {
                useCache: false,
            },
        );
    }
}

export class CommandEditInstance extends CommandInstance<void> {
    private tagName!: string;
    private newTagBody!: string;
    private tagBodyHash!: SHA256Hash;
    private tag!: TagTable;

    protected async validateData(): Promise<void> {
        this.tagName = this.arg<string>("tag-name");
        this.newTagBody = this.arg<string[]>("new-tag-body").join(" ");

        //TODO: More validation on name being valid, body not being empty, etc.

        await this.ensureTagNameExists();
        await this.ensureUniqueBody();
        await this.ensureOwner();
    }

    protected async execute(): Promise<void> {
        await this.tagService.updateTag({
            tagName: this.tagName,
            tagBody: this.newTagBody,
            tagBodyHash: this.tagBodyHash,
        });
        await this.invalidateCache();
    }

    protected async reply(): Promise<void> {
        await this.context.message.reply(`${Emojis.CHECKMARK} Tag \`${this.tagName}\` edited successfully!`);
    }

    protected logExecution(): void {
        core.logger.info(`User ${this.context.author.tag} edited tag: ${this.tagName}`);
    }

    /*
     * Helpers
     */

    private async ensureTagNameExists() {
        const tag = await this.tagService.findTag(this.tagName);
        if (!tag) {
            throw new TagNotFoundError(this.tagName);
        }
        this.tag = tag;
    }

    private async ensureUniqueBody() {
        const hashContext = await this.tagService.tagBodyExists(this.newTagBody);

        if (hashContext.exists) {
            if (hashContext.tagWithBody.name === this.tagName) {
                throw new TagBodyExistsError(this.tagName, this.newTagBody, hashContext.tagWithBody, "edit");
            }
            throw new TagBodyExistsError(this.tagName, this.newTagBody, hashContext.tagWithBody, "add");
        }
        this.tagBodyHash = hashContext.hash;
    }

    private async ensureOwner() {
        const user = await this.userService.findOrCreateUser(this.context.author);
        if (this.tag.author.discordId !== this.context.author.id) {
            throw new NotOwnerError(this.tag.author, user, this.tag);
        }
    }

    private async invalidateCache() {
        await commands.tag.invalidateCache();
    }
}
