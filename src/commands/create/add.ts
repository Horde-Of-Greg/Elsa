import { CommandDef, CommandContext, CommandInstance, ParseResult } from '../Command';
import { NoParsingError } from '../../core/errors/internal/commands';
import { MissingArgumentError } from '../../core/errors/client/400';
import { config } from '../../config/config';
import { TagBodyExistsError, TagExistsError } from '../../core/errors/client/409';
import { SHA256Hash } from '../../utils/crypto/sha256Hash';
import { app } from '../../core/App';
import { PermLevel } from '../../db/entities/UserHost';

export class CommandAddDef extends CommandDef<CommandAddInstance> {
    constructor() {
        super({
            name: 'add',
            aliases: ['a'],
            permLevelRequired: PermLevel.TRUSTED,
            cooldown_s: 5,
        });
    }

    createInstance(context: CommandContext, parseResult: ParseResult): CommandAddInstance {
        return new CommandAddInstance(context, parseResult, this.params);
    }
}

class CommandAddInstance extends CommandInstance {
    // Ex: !add <name:test> <content:...>
    private tagName!: string;
    private tagBody!: string;
    private tagBodyHash!: SHA256Hash;

    protected async validateArguments(): Promise<void> {
        if (!this.parseResult) {
            throw new NoParsingError(this.context.message);
        }

        if (!this.parseResult.subcommand || !this.parseResult.args) {
            throw new MissingArgumentError(
                `Could not add tag. Missing arguments. See \`${config.PREFIX}help\` for usage`,
            );
        }

        this.tagName = this.parseResult.subcommand;
        this.tagBody = this.parseResult.args.join('');

        if (await this.tagService.tagExists(this.tagName)) {
            throw new TagExistsError(this.tagName);
        }
        const hashContext = await this.tagService.tagBodyExists(this.tagBody);

        if (hashContext.exists) {
            throw new TagBodyExistsError(this.tagBody, hashContext.tagWithBody);
        }
        this.tagBodyHash = hashContext.hash;
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
}
