import type { Message } from "discord.js";

import { appConfig } from "../config/appConfig";
import type { CommandDef, CommandInstance } from "./Command";
import { commands } from "./Commands";
import type { CommandContext, ParseResult } from "./types";

export class CommandRouter {
    private commandList: CommandDef<CommandInstance>[];
    private hashMap: Map<string, CommandDef<CommandInstance>>;
    private matcher!: RegExp;

    constructor() {
        this.commandList = commands.getAll();
        this.hashMap = new Map();
        this.buildHashMap();
    }

    async route(context: CommandContext): Promise<void> {
        const parseResult = this.parse(context.message);
        if (!parseResult) return;

        const commandDef = this.hashMap.get(parseResult.command);
        if (!commandDef) return;

        const instance = commandDef.createInstance(context, parseResult);

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

    private parse(message: Message): ParseResult | null {
        const pattern = [
            "^",
            appConfig.PREFIX,
            "([a-z0-9]+)",
            "(?:-([a-z0-9]*))?",
            "(?:\\s(\\w+))?",
            "(?:\\s([\\w\\s]+))?",
            "$",
        ].join("");

        this.matcher = new RegExp(pattern, "i");
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
}
