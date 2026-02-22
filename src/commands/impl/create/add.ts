import { emojis } from "../../../config/config.js";
import { core } from "../../../core/Core.js";
import { PermLevel } from "../../../db/entities/UserHost.js";
import { TagBodyExistsError, TagExistsError } from "../../../errors/client/409.js";
import type { SHA256Hash } from "../../../types/crypto.js";
import { ensureStrictPositive } from "../../../utils/numbers/positive.js";
import { CommandDef, CommandInstance } from "../../Command.js";

export class CommandAddDef extends CommandDef<void, CommandAddInstance> {
    constructor() {
        super(
            {
                name: "add",
                aliases: ["a"],
                permLevelRequired: PermLevel.DEFAULT,
                cooldowns: {
                    channel: ensureStrictPositive(5),
                    guild: ensureStrictPositive(5),
                },
                info: {
                    description: "Adds a new command to the database",
                    arguments: [
                        { name: "tag-name", required: true, parseResultKey: "subcommand" },
                        { name: "tag-body", required: true, parseResultKey: "args" },
                    ],
                },
            },
            CommandAddInstance,
            {
                useCache: false,
            },
        );
    }
}

class CommandAddInstance extends CommandInstance<void> {
    private tagName!: string;
    private tagBody!: string;
    private tagBodyHash!: SHA256Hash;

    protected async validateData(): Promise<void> {
        this.tagName = this.arg<string>("tag-name");
        this.tagBody = this.arg<string[]>("tag-body").join(" ");

        //TODO: More validation on name being valid, body not being empty, etc.

        await this.ensureUniqueTagName();
        await this.ensureUniqueBody();
    }

    protected async execute(): Promise<void> {
        await this.tagService.createTag({
            tagName: this.tagName,
            tagBody: this.tagBody,
            tagBodyHash: this.tagBodyHash,
            author: this.context.author,
            guild: this.context.guild,
        });
    }

    protected async reply(): Promise<void> {
        await this.context.message.reply(`Tag \`${this.tagName}\` created successfully! ${emojis.CHECKMARK}`);
    }

    protected logExecution(): void {
        core.logger.info(`User ${this.context.author.tag} created tag: ${this.tagName}`);
    }

    /*
     * Helpers
     */

    private async ensureUniqueTagName() {
        const candidate = await this.tagService.findTag(this.tagName);
        if (candidate) {
            throw new TagExistsError(candidate);
        }
    }

    private async ensureUniqueBody() {
        const hashContext = await this.tagService.tagBodyExists(this.tagBody);

        if (hashContext.exists) {
            throw new TagBodyExistsError(this.tagName, this.tagBody, hashContext.tagWithBody, "add");
        }
        this.tagBodyHash = hashContext.hash;
    }
}
