import type { Message } from "discord.js";

import { PermLevel } from "../../../assets/db/permLevel";
import type { DependenciesResolver } from "../../../types/core/dependencies";
import type { _ms } from "../../../types/time/time";
import type { TimerResult } from "../../../types/time/timer";
import { CommandDef, CommandInstance } from "../../Command";
import type { Commands } from "../../Commands";

export class CommandPingDef extends CommandDef<void, CommandPingInstance> {
    constructor(dependencies: DependenciesResolver, commands: Commands) {
        super(
            {
                name: "ping",
                aliases: ["p"],
                permLevelRequired: PermLevel.DEFAULT,
                cooldowns: {
                    channel: -1,
                    guild: -1,
                },
                info: {
                    description: "Check if the bot is up, and its latency.",
                },
            },
            CommandPingInstance,
            {
                useCache: false,
            },
            dependencies,
            commands,
        );
    }
}

export class CommandPingInstance extends CommandInstance<void> {
    private serverLatency: TimerResult;

    protected async validateData(): Promise<void> {}

    protected async execute(): Promise<void> {}

    protected async reply(): Promise<Message> {
        this.serverLatency = this.dependencies.timers.queryTimer(this.timerKey).getTime("ms");
        return this.context.message.reply(`${this.dependencies.configs.emoji.PING_PONG} Pinging...`);
    }

    protected async postReply(sentMessage: Message): Promise<void> {
        const roundTripLatency: _ms = (sentMessage.createdTimestamp -
            this.context.message.createdTimestamp) as _ms;

        await sentMessage.edit(
            `${this.dependencies.configs.emoji.PING_PONG} Pong!\n` +
                `**Total latency:** \`${roundTripLatency}ms\` ${roundTripLatency > 1000 ? this.dependencies.configs.emoji.WORRIED : ""}\n` +
                `**Server latency:** \`${this.serverLatency.formatted}\` ${this.serverLatency.raw > 1e8 ? this.dependencies.configs.emoji.WORRIED : ""}\n`,
        );
    }

    protected logExecution(): void {}
}
