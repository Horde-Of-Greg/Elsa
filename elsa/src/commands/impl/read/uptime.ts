import type { Message } from "discord.js";

import { PermLevel } from "../../../assets/db/permLevel";
import type { DependenciesResolver } from "../../../types/core/dependencies";
import type { TimerResult } from "../../../types/time/timer";
import { CommandDef, CommandInstance } from "../../Command";
import type { Commands } from "../../Commands";

export class CommandUptimeDef extends CommandDef<void, CommandUptimeInstance> {
    constructor(dependencies: DependenciesResolver, commands: Commands) {
        super(
            {
                name: "uptime",
                aliases: ["ut", "up"],
                permLevelRequired: PermLevel.DEFAULT,
                cooldowns: {
                    channel: -1,
                    guild: -1,
                },
                info: {
                    description: "Check how long the bot has been up for.",
                },
                hideFromHelp: true,
            },
            CommandUptimeInstance,
            {
                useCache: false,
            },
            dependencies,
            commands,
        );
    }
}

export class CommandUptimeInstance extends CommandInstance<void> {
    private uptime!: TimerResult;
    private startDate!: Date;

    protected async validateData(): Promise<void> {}

    protected async execute(): Promise<void> {
        const timer = this.dependencies.timers.queryTimer("main");
        this.uptime = timer.getTime();
        this.startDate = timer.getStartDate();
    }

    protected async reply(): Promise<Message> {
        const unixTimestamp = Math.floor(this.startDate.getTime() / 1000);

        return this.context.message.reply(
            `**${this.dependencies.configs.app.NAME}** has been up for \`${this.uptime.formatted}\` (Since <t:${unixTimestamp}:F>)`,
        );
    }

    protected async postReply(sentMessage: Message): Promise<void> {}

    protected logExecution(): void {}
}
