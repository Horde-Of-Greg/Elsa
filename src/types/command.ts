import type { Channel, Guild, Message, User } from "discord.js";

import type { PermLevel } from "../db/entities/UserHost";
import type { StrictPositiveNumber } from "./numbers";

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
    hideFromHelp?: boolean;
};

export type CacheParams =
    | {
          useCache: true;
          ttl_s: StrictPositiveNumber;
          clear: boolean;
      }
    | {
          useCache: false;
      };

export type validCooldown = StrictPositiveNumber | -1;

export type RequirableParseResult = Exclude<keyof ParseResult, "command" | "server">;

export type ArgumentDefinition = {
    name: string;
    required: boolean;
    parseResultKey: RequirableParseResult;
};

export type Versions = {
    local: string;
    remote: string;
};
