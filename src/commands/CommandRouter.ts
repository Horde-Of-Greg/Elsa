import type { Message } from "discord.js";

import { Cache } from "../caching/Cache";
import { appConfig } from "../config/config";
import { core } from "../core/Core";
import type { CommandContext, ParseResult } from "../types/command";
import { computeSHA256 } from "../utils/crypto/sha256Hash";
import { ensureStrictPositive } from "../utils/numbers/positive";
import type { CommandDef, CommandInstance } from "./Command";
import { commands } from "./Commands";

export class CommandRouter {
    private commandList: CommandDef<unknown, CommandInstance<unknown>>[];
    private hashMap: Map<string, CommandDef<unknown, CommandInstance<unknown>>>;
    private _matcher?: RegExp;
    private parseCache: Cache<ParseResult>;

    constructor() {
        this.commandList = commands.getAll();
        this.hashMap = new Map();
        this.buildHashMap();
        this.parseCache = new Cache("cmd-parse", ensureStrictPositive(3600), false);
    }

    async route(context: CommandContext): Promise<void> {
        const cacheKey = this.buildCacheKey(context.message.content);
        const parseResult = await this.tryCache(cacheKey, context.message);
        if (!parseResult) return;

        await this.setCache(cacheKey, parseResult);

        const commandDef = this.hashMap.get(parseResult.command);
        if (!commandDef) return;

        const instance = commandDef.createInstance(context, parseResult, cacheKey);

        await instance.run();
    }

    private buildHashMap() {
        for (const command of this.commandList) {
            const aliases = command.getIdentifiers();
            for (const alias of aliases) {
                this.hashMap.set(alias, command);
            }
        }
    }

    private async tryCache(key: string, message: Message): Promise<ParseResult | null> {
        let parseResult = await this.parseCache.get(key);

        if (!parseResult) {
            parseResult = this.parse(message);
        } else {
            core.logger.debug("Parse: Cache Hit!");
        }

        return parseResult;
    }

    private parse(message: Message): ParseResult | null {
        const parsed = message.content.match(this.matcher);

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
            args: parsed[4] ? parsed[4].split(/\s+/) : undefined,
        };
    }

    private async setCache(key: string, parseResult: ParseResult) {
        await this.parseCache.set(key, parseResult);
    }

    private buildCacheKey(content: string) {
        return computeSHA256(content).toString();
    }

    private get matcher() {
        return (this._matcher ??= new RegExp(CommandRouter.pattern, "i"));
    }

    private static pattern = [
        "^",
        appConfig.PREFIX,
        "([a-z0-9]+)",
        "(?:-([a-z0-9]*))?",
        "(?:\\s(\\w+))?",
        "(?:\\s([\\w\\s]+))?",
        "$",
    ].join("");
}
