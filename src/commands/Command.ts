import { Channel, Guild, Message, User } from 'discord.js';
import { PermLevel } from '../db/entities/UserHost';
import { config } from '../config/config';
import { app } from '../core/App';
import { UserService } from '../services/UserService';
import { TagService } from '../services/TagService';
import { PermissionsService } from '../services/PermsService';
import { HostService } from '../services/HostService';
import { NoContextError, NoGuildError } from '../core/errors/internal/commands';
import { CommandContext, CommandParams, ParseResult } from './types';

// Constructor type for CommandInstance subclasses
type CommandInstanceConstructor<TInstance extends CommandInstance> = new (
    context: CommandContext,
    parseResult: ParseResult,
    params: CommandParams,
) => TInstance;

export abstract class CommandDef<TInstance extends CommandInstance> {
    constructor(
        protected params: CommandParams,
        private instanceConstructor: CommandInstanceConstructor<TInstance>,
    ) {}

    parse(message: Message): ParseResult | null {
        const pattern = [
            '^',
            config.PREFIX,
            '([a-z0-9]+)',
            '(?:-([a-z0-9]*))?',
            '(?:\\s(\\w+))?',
            '(?:\\s([\\w\\s]+))?',
            '$',
        ].join('');

        const matcher = new RegExp(pattern, 'i');
        const parsed = message.content.match(matcher);

        if (!parsed) return null;

        /*
         * Example parsing: !tag-nomi oc 1
         *
         * match        name        optional?       Match in example
         * --------------------------------------------------------------------------
         * null         prefix      Necessary       Matches "!"" (if ! is set as the prefix)
         * 1            command     Necessary       Matches "tag"
         * 2            server      Optional        Matches "nomi"
         * 3            subcommand  Optional        Matches "oc"
         * 4            args        Optional        Matches "30 10 15 5"
         */
        return {
            command: parsed[1],
            server: parsed[2],
            subcommand: parsed[3],
            args: parsed[4]?.split(/\s+/),
        };
    }

    /**
     * Get all command identifiers (name + aliases).
     */
    getIdentifiers(): string[] {
        return this.params.aliases.concat(this.params.name);
    }

    /**
     * Get command metadata.
     */
    getParams(): CommandParams {
        return this.params;
    }

    /**
     * Create a new instance to execute this command.
     */
    createInstance(context: CommandContext, parseResult: ParseResult): TInstance {
        return new this.instanceConstructor(context, parseResult, this.params);
    }
}

export abstract class CommandInstance {
    protected permsService: PermissionsService = app.services.permsService;
    protected hostService: HostService = app.services.hostService;
    protected tagService: TagService = app.services.tagService;
    protected userService: UserService = app.services.userService;

    constructor(
        protected context: CommandContext,
        protected parseResult: ParseResult,
        protected params: CommandParams,
    ) {}

    async run(): Promise<void> {
        try {
            await this.checkCooldown();
            await this.validateArguments();
            await this.validatePermissions();
            await this.execute();
            await this.reply();
            this.updateCooldown();
            this.logExecution?.();
        } catch (error: any) {
            await this.replyError(error);
        }
    }

    private async checkCooldown(): Promise<void> {
        //TODO: Impl cooldowns
    }
    protected updateCooldown(): void {}

    /**
     * Describe which of the optional elements in CommandContext should be used, and update a local context.
     * Should fail on invalid arguments.
     */
    protected abstract validateArguments(): Promise<void>;

    /**
     * Describe what the command should do.
     */
    protected abstract execute(): Promise<void>;

    /**
     * Describe how the command should reply to the user in discord.
     */
    protected abstract reply(): Promise<void>;

    private async validatePermissions(): Promise<void> {
        if (!this.context) {
            throw new NoContextError();
        }

        this.permsService.requirePermLevel(
            this.context.author,
            this.context.guild,
            this.params.permLevelRequired,
        );
    }

    /**
     * (optional) Describe what the command should log in the server logs.
     */
    protected abstract logExecution?(): void;

    private async replyError(error: Error): Promise<void> {
        /* TODO: Implement way better responses. Maybe give AppError a reply() abstract method which describes how to reply per Error.
         * Also make sure errors are displayed to the client. This could be a different abstract in AppError.
         */
        app.core.logger.simpleLog('error', error.message);
        this.context.message.reply(error.message);
    }
}
