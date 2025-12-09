import { Channel, EmbedBuilder, Guild, Message, User } from 'discord.js';
import { PermLevel } from '../db/entities/UserHost';
import { config } from '../config/config';
import { app } from '../core/App';
import { UserService } from '../services/UserService';
import { TagService } from '../services/TagService';
import { PermissionsService } from '../services/PermsService';
import { HostService } from '../services/HostService';
import {
    ArgNotDefinedError,
    NoArgsDefinedError,
    NoContextError,
    NoGuildError,
} from '../core/errors/internal/commands';
import { CommandContext, CommandParams, ParseResult, RequirableParseResult } from './types';
import { commands } from './Commands';
import { MissingArgumentError } from '../core/errors/client/400';
import { computeSHA256, SHA256Hash } from '../utils/crypto/sha256Hash';
import { AppError } from '../core/errors/AppError';

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

    protected timerKey: string = this.makeTimerKey();

    constructor(
        protected context: CommandContext,
        protected parseResult: ParseResult,
        protected params: CommandParams,
    ) {}

    async run(): Promise<void> {
        try {
            app.core.startTimer(this.timerKey);
            await this.checkCooldown();
            await this.validateData();
            await this.validatePermissions();
            await this.execute();
            await this.reply();
            this.updateCooldown();
            this.logExecution?.();
        } catch (error: any) {
            await this.replyError(error);
        } finally {
            app.core.stopTimer(this.timerKey);
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
    protected abstract validateData(): Promise<void>;

    /**
     * Describe what the command should do.
     */
    protected abstract execute(): Promise<void>;

    /**
     * Describe how the command should reply to the user in discord.
     */
    protected abstract reply(): Promise<void>;

    /**
     * Describe what the command should log in the server logs. Can be left empty.
     */
    protected abstract logExecution(): void;

    /*
     * Inherited Helpers
     */

    /**
     * Get argument value by name from metadata.
     * Automatically uses required/optional based on ArgumentDefinition.
     */
    protected arg<T = any>(name: string): T {
        if (!this.params.info.arguments) {
            throw new NoArgsDefinedError(name, this.constructor.name);
        }

        const argDef = this.params.info.arguments.find((a) => a.name === name);

        if (!argDef) {
            throw new ArgNotDefinedError(name, this.constructor.name);
        }

        let value: any;
        if (argDef.required) {
            value = this.requireParseResult(argDef.parseResultKey);
        } else {
            value = this.optionalParseResult(argDef.parseResultKey);
        }

        return value;
    }

    /*
     * Local Helpers
     */

    private makeTimerKey() {
        return `cmd:${this.context.message.id}`;
    }

    private async validatePermissions(): Promise<void> {
        if (!this.context) {
            throw new NoContextError();
        }

        await this.permsService.requirePermLevel(
            this.context.author,
            this.context.guild,
            this.params.permLevelRequired,
        );
    }

    private requireParseResult<K extends RequirableParseResult>(
        key: K,
    ): NonNullable<ParseResult[K]> {
        const value = this.parseResult[key];
        if (!value) {
            throw new MissingArgumentError(
                `Missing arguments. See \`${config.PREFIX}help\` for details on command usages.`,
            );
        }

        return value as NonNullable<ParseResult[K]>;
    }

    private optionalParseResult<K extends RequirableParseResult>(key: K): ParseResult[K] {
        return this.parseResult[key];
    }

    private async replyError(error: Error): Promise<void> {
        /* TODO: Implement way better responses. Maybe give AppError a reply() abstract method which describes how to reply per Error.
         * Also make sure errors are displayed to the client. This could be a different abstract in AppError.
         */

        if (error instanceof AppError && /4\d\d/.test(error.httpStatus.toString())) {
            await this.context.message.reply(error.message);
            return;
        }

        app.core.logger.simpleLog('error', error.message);

        const stack = error.stack ?? 'No stack trace available';
        const stackLines = stack.match(/^\s+at\s+(.+?)\s+\(/gm);
        const methodNames = stackLines
            ? stackLines.map((line) => line.match(/at\s+(.+?)\s+\(/)?.[1] || line)
            : [stack];
        const truncatedStack = methodNames.join('\n').slice(0, 1000);

        const embed = new EmbedBuilder()
            .setTitle('Internal Error Occurred')
            .setDescription('This is not your fault. It is ours. Oopsies.')
            .setColor(0xff0000) // Red
            .addFields(
                {
                    name: 'Code',
                    value: error instanceof AppError ? error.code : 'UNKNOWN',
                    inline: true,
                },
                {
                    name: 'Message',
                    value: error.message || 'No message provided',
                    inline: false,
                },
                {
                    name: 'Trace',
                    value: `\`\`\`${truncatedStack}\`\`\``,
                    inline: false,
                },
            );

        await this.context.message.reply({ embeds: [embed] });
    }
}
