import { NoParsingError } from '../../../core/errors/internal/commands';
import { MissingArgumentError } from '../../../core/errors/client/400';
import { config } from '../../../config/config';
import { TagBodyExistsError, TagExistsError } from '../../../core/errors/client/409';
import { SHA256Hash } from '../../../utils/crypto/sha256Hash';
import { app } from '../../../core/App';
import { PermLevel } from '../../../db/entities/UserHost';
import { CommandDef, CommandInstance } from '../../Command';

export class CommandAddDef extends CommandDef<CommandAddInstance> {
    constructor() {
        super(
            {
                name: 'add',
                aliases: ['a'],
                permLevelRequired: PermLevel.DEFAULT,
                cooldown_s: 5,
                info: {
                    description: 'Adds a new command to the database',
                    arguments: [
                        { name: 'tag-name', required: true, parseResultKey: 'subcommand' },
                        { name: 'tag-body', required: true, parseResultKey: 'args' },
                    ],
                },
            },
            CommandAddInstance,
        );
    }
}

class CommandAddInstance extends CommandInstance {
    private tagName!: string;
    private tagBody!: string;
    private tagBodyHash!: SHA256Hash;

    protected async validateData(): Promise<void> {
        this.tagName = this.arg<string>('tag-name');
        this.tagBody = this.arg<string[]>('tag-body').join(' ');

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
        await this.context.message.reply(
            `:white_check_mark: Tag \`${this.tagName}\` created successfully!`,
        );
    }

    protected logExecution(): void {
        app.core.logger.simpleLog(
            'info',
            `User ${this.context.author.tag} created tag: ${this.tagName}`,
        );
    }

    /*
     * Helpers
     */

    private async ensureUniqueTagName() {
        if (await this.tagService.tagExists(this.tagName)) {
            throw new TagExistsError(this.tagName);
        }
    }

    private async ensureUniqueBody() {
        const hashContext = await this.tagService.tagBodyExists(this.tagBody);

        if (hashContext.exists) {
            throw new TagBodyExistsError(this.tagBody, hashContext.tagWithBody);
        }
        this.tagBodyHash = hashContext.hash;
    }
}
