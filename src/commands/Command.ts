import { Cache } from "../caching/Cache";
import { appConfig } from "../config/config";
import type { ServicesResolver } from "../core/containers/Services";
import { core } from "../core/Core";
import { AppError } from "../errors/AppError";
import { MissingArgumentError } from "../errors/client/400";
import { ArgNotDefinedError, NoArgsDefinedError } from "../errors/internal/commands";
import { UnknownInternalError } from "../errors/internal/InternalError";
import type { CooldownService } from "../services/CooldownService";
import type { HostService } from "../services/HostService";
import type { PermissionsService } from "../services/PermsService";
import type { TagService } from "../services/TagService";
import type { UserService } from "../services/UserService";
import type {
    CacheParams,
    CommandContext,
    CommandParams,
    ParseResult,
    RequirableParseResult,
} from "../types/command";
import { dependencies } from "./../core/Dependencies";

type CommandInstanceConstructor<TReply, LInstance extends CommandInstance<TReply>> = new (
    context: CommandContext,
    parseResult: ParseResult,
    cacheKey: string,
    params: CommandParams,
    services: ServicesResolver,
    cache: Cache<TReply> | undefined,
    cacheParams: CacheParams,
) => LInstance;

export abstract class CommandDef<TReply, LInstance extends CommandInstance<TReply>> {
    cache: Cache<TReply> | undefined;

    constructor(
        protected params: CommandParams,
        private instanceConstructor: CommandInstanceConstructor<TReply, LInstance>,
        private cacheParams: CacheParams,
        private services = dependencies.services,
        private cacheProvider = dependencies.cache,
    ) {
        this.buildCache();
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
    createInstance(context: CommandContext, parseResult: ParseResult, cacheKey: string): LInstance {
        return new this.instanceConstructor(
            context,
            parseResult,
            cacheKey,
            this.params,
            this.services,
            this.cache,
            this.cacheParams,
        );
    }

    private buildCache() {
        this.cache = this.cacheParams.useCache
            ? new Cache(
                  `cmd-run:${this.params.name}`,
                  this.cacheParams.ttl_s,
                  this.cacheParams.clear,
                  this.cacheProvider,
              )
            : undefined;
    }

    async invalidateCache() {
        if (!this.cache) return;
        await this.cache.clear();
    }
}

export abstract class CommandInstance<TReply> {
    protected cooldownService: CooldownService;
    protected permsService: PermissionsService;
    protected hostService: HostService;
    protected tagService: TagService;
    protected userService: UserService;
    protected content: TReply;

    protected timerKey: string = this.makeTimerKey();

    constructor(
        protected context: CommandContext,
        protected parseResult: ParseResult,
        protected cacheKey: string,
        protected params: CommandParams,
        protected readonly services: ServicesResolver,
        protected cache: Cache<TReply> | undefined,
        protected cacheParams: CacheParams,
    ) {
        this.cooldownService = this.services.cooldownService;
        this.permsService = this.services.permsService;
        this.hostService = this.services.hostService;
        this.tagService = this.services.tagService;
        this.userService = this.services.userService;
    }

    async run(): Promise<void> {
        try {
            core.startTimer(this.timerKey);
            await this.validateData();
            await this.validatePermissions();
            await this.checkCooldown();
            await this.getContent();
            await this.reply();
            this.logExecution();
        } catch (error: unknown) {
            await this.replyError(error instanceof Error ? error : new Error(String(error)));
        } finally {
            core.stopTimer(this.timerKey);
        }
    }

    /**
     * Describe which of the optional elements in CommandContext should be used, and update a local context.
     * Should fail on invalid arguments.
     */
    protected abstract validateData(): Promise<void>;

    /**
     * Describe what the command should do.
     */
    protected abstract execute(): Promise<TReply>;

    /**
     * Describe how the command should reply to the user in discord.
     */
    protected abstract reply(): Promise<void>;

    /**
     * Describe what the command should log in the server logs. Can be left empty.
     */
    protected abstract logExecution(): void;

    private async getContent(): Promise<void> {
        if (!this.cache) {
            await this.execute();
            return;
        }
        let content = await this.cache.get(this.cacheKey);

        if (!content) {
            content = await this.execute();
        } else {
            core.logger.debug(`${this.params.name}: Cache Hit!`);
        }

        this.content = content;
        await this.cache.set(this.cacheKey, this.content);
    }

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

    private async checkCooldown(): Promise<void> {
        await this.cooldownService.assertCooldownOk(this.context.author, this.context.guild, this.params);
        await this.cooldownService.assertCooldownOk(this.context.author, this.context.channel, this.params);
    }

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

    private requireParseResult<K extends RequirableParseResult>(key: K): NonNullable<ParseResult[K]> {
        const value = this.parseResult[key];
        if (value === undefined) {
            throw new MissingArgumentError(`See \`${appConfig.PREFIX}help\` for details on command usages.`);
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
