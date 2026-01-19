import { emojis } from "../../../config/config";
import { core } from "../../../core/Core";
import { PermLevel } from "../../../db/entities/UserHost";
import type { _ms } from "../../../types/time/time";
import { CommandDef, CommandInstance } from "../../Command";

export class CommandPingDef extends CommandDef<void, CommandPingInstance> {
    constructor() {
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
        );
    }
}

export class CommandPingInstance extends CommandInstance<void> {
    protected async validateData(): Promise<void> {}

    protected async execute(): Promise<void> {}

    protected async reply(): Promise<void> {
        const serverLatency = core.queryTimer(this.timerKey).getTime("ms");
        const sent = await this.context.message.reply(`${emojis.PING_PONG} Pinging...`);

        const roundTripLatency: _ms = (sent.createdTimestamp - this.context.message.createdTimestamp) as _ms;

        await sent.edit(
            `${emojis.PING_PONG} Pong!\n` +
                `**Total latency:** \`${roundTripLatency}ms\` ${roundTripLatency > 1000 ? emojis.WORRIED : ""}\n` +
                `**Server latency:** \`${serverLatency.formatted}\` ${serverLatency.raw > 1e8 ? emojis.WORRIED : ""}\n`,
        );
    }
    protected logExecution(): void {}
}
