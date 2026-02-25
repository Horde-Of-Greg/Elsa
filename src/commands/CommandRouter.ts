import type { Message } from "discord.js";

import { appConfig } from "../config/config";
import type { CommandContext, ParseResult } from "../types/command";
import { computeSHA256 } from "../utils/crypto/sha256Hash";
import type { CommandDef, CommandInstance } from "./Command";
import { commands } from "./Commands";

export class CommandRouter {
    private readonly commandList: CommandDef<unknown, CommandInstance<unknown>>[];
    public readonly commandMap: Map<string, CommandDef<unknown, CommandInstance<unknown>>>;
    private _matcher?: RegExp;

    constructor() {
        this.commandList = commands.allCommands;
        this.commandMap = new Map();
        this.buildHashMap();
    }

    async route(context: CommandContext): Promise<void> {
        const cacheKey = this.buildCacheKey(context.message.content);
        const parseResult = this.parse(context.message);
        if (!parseResult) return;

        const commandDef = this.commandMap.get(parseResult.command);
        if (!commandDef) return;

        const instance = commandDef.createInstance(context, parseResult, cacheKey, this.commandMap);

        await instance.run();
    }

    private buildHashMap() {
        for (const command of this.commandList) {
            const aliases = command.getIdentifiers();
            for (const alias of aliases) {
                this.commandMap.set(alias, command);
            }
        }
    }

    private parse(message: Message): ParseResult | null {
        const parsed = new RegExp(this.matcher).exec(message.content);

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

    private buildCacheKey(content: string) {
        return computeSHA256(content).toString();
    }

    private get matcher() {
        const matcher = (this._matcher ??= new RegExp(this.pattern, "i"));
        return matcher;
    }

    private readonly pattern = [
        "^",
        `\\${appConfig.PREFIX}`,
        "([a-z0-9]+)",
        "(?:-([a-z0-9]*))?",
        String.raw`(?:\s(\w+))?`,
        String.raw`(?:\s(.+))?`,
        "$",
    ].join("");
}
