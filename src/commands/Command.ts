import { config } from '../config/config';
import { app } from '../core/App';
import type { UserService } from '../services/UserService';
import type { TagService } from '../services/TagService';
import type { PermissionsService } from '../services/PermsService';
import type { HostService } from '../services/HostService';
import { ArgNotDefinedError, NoArgsDefinedError } from '../core/errors/internal/commands';
import type {
    CommandContext,
    CommandParams,
    CooldownKeys,
    ParseResult,
    RequirableParseResult,
    validCooldown,
} from './types';
import { MissingArgumentError } from '../core/errors/client/400';
import { AppError } from '../core/errors/AppError';
import { UnknownInternalError } from '../core/errors/internal/InternalError';
import { getTimeNow, type AppDate } from '../utils/time';
import { CooldownError } from '../core/errors/client/429';

//TODO: Use Redis for this.
const channelCooldowns = new Map<string, AppDate>();
const guildCooldowns = new Map<string, AppDate>();

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
    protected cooldownKeys: CooldownKeys = this.makeCooldownKey();

    constructor(
        protected context: CommandContext,
        protected parseResult: ParseResult,
        protected params: CommandParams,
    ) {}

    async run(): Promise<void> {
        try {
            app.core.startTimer(this.timerKey);
            await this.validateData();
            await this.validatePermissions();
            this.checkCooldowns();
            await this.execute();
            await this.reply();
            this.updateCooldown();
            this.logExecution();
        } catch (error: unknown) {
            await this.replyError(error instanceof Error ? error : new Error(String(error)));
        } finally {
            app.core.stopTimer(this.timerKey);
        }
    }

    private checkCooldowns(): void {
        this.checkChannelCooldown();
        this.checkGuildCooldown();
    }

    protected updateCooldown(): void {
        channelCooldowns.set(this.cooldownKeys.channel, getTimeNow());
        guildCooldowns.set(this.cooldownKeys.guild, getTimeNow());
    }

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
        if (value === undefined) {
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

    private makeCooldownKey(): CooldownKeys {
        return {
            channel: `${this.params.name}:${this.context.author.id}:${this.context.channel.id}`,
            guild: `${this.params.name}:${this.context.author.id}:${this.context.guild.id}`,
        };
    }

    private checkCooldown(cd_s: validCooldown, lastRan: AppDate | undefined): void {
        if (cd_s === 'disabled') return;
        if (!lastRan) return;

        const timeSinceLastCommand_ms = getTimeNow().getTime() - lastRan.getTime();
        const timeSinceLastCommand_s = timeSinceLastCommand_ms / 1000;
        const diff = cd_s - timeSinceLastCommand_s;
        if (diff > 0) {
            throw new CooldownError(diff, this.context.author, this.params);
        }
    }

    private checkChannelCooldown(): void {
        this.checkCooldown(
            this.params.cooldowns.channel,
            channelCooldowns.get(this.cooldownKeys.channel),
        );
    }

    private checkGuildCooldown(): void {
        this.checkCooldown(
            this.params.cooldowns.guild,
            guildCooldowns.get(this.cooldownKeys.guild),
        );
    }
}
