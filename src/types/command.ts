import type { Channel, Guild, Message, User } from "discord.js";

import type { PermLevel } from "../db/entities/UserHost";
import type { PositiveNumber } from "../types/numbers";

export type CommandContext = {
    message: Message;
    author: User;
    guild: Guild;
    channel: Channel;
};

export type ParseResult = {
    command: string;
    server?: string;
    subcommand?: string;
    args?: string[];
};

export type CommandParams = {
    name: string;
    aliases: string[];
    permLevelRequired: PermLevel;
    cooldowns: { channel: validCooldown; guild: validCooldown };
    info: {
        description: string;
        arguments?: ArgumentDefinition[];
        examples?: string[];
    };
};

export type validCooldown = PositiveNumber | -1;

export type RequirableParseResult = Exclude<keyof ParseResult, "command" | "server">;

export type ArgumentDefinition = {
    name: string;
    required: boolean;
    parseResultKey: RequirableParseResult;
};
