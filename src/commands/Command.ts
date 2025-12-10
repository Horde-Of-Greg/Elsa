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
} from '../core/errors/internal/commands';
import { CommandContext, CommandParams, ParseResult, RequirableParseResult } from './types';
import { MissingArgumentError } from '../core/errors/client/400';
import { AppError } from '../core/errors/AppError';
import { UnknownInternalError } from '../core/errors/internal/InternalError';

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
        } catch (error: unknown) {
            await this.replyError(error instanceof Error ? error : new Error(String(error)));
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
    protected arg<T = unknown>(name: string): T {
        if (!this.params.info.arguments) {
            throw new NoArgsDefinedError(name, this.constructor.name);
        }

        const argDef = this.params.info.arguments.find((a) => a.name === name);

        if (!argDef) {
            throw new ArgNotDefinedError(name, this.constructor.name);
        }

        let value: unknown;
        if (argDef.required) {
            value = this.requireParseResult(argDef.parseResultKey);
        } else {
            value = this.optionalParseResult(argDef.parseResultKey);
        }

        return value as T;
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
                `See \`${config.PREFIX}help\` for details on command usages.`,
            );
        }

        return value as NonNullable<ParseResult[K]>;
    }

    private optionalParseResult<K extends RequirableParseResult>(key: K): ParseResult[K] {
        return this.parseResult[key];
    }

    private async replyError(e: Error): Promise<void> {
        let error: AppError;

        if (!(e instanceof AppError)) {
            error = new UnknownInternalError(e.message, e.stack);
        } else {
            error = e;
        }

        error.log();
        await this.context.message.reply(error.reply);
    }
}
