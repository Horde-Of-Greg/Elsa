import { appConfig } from "../../../config/config.js";
import { core } from "../../../core/Core.js";
import { PermLevel } from "../../../db/entities/UserHost.js";
import type { TimerResult } from "../../../types/time/timer.js";
import { CommandDef, CommandInstance } from "../../Command.js";

export class CommandUptimeDef extends CommandDef<void, CommandUptimeInstance> {
    constructor() {
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
        );
    }
}

export class CommandUptimeInstance extends CommandInstance<void> {
    private uptime!: TimerResult;
    private startDate!: Date;

    protected async validateData(): Promise<void> {}

    protected async execute(): Promise<void> {
        const timer = core.queryTimer("main");
        this.uptime = timer.getTime();
        this.startDate = timer.getStartDate();
    }

    protected async reply(): Promise<void> {
        const unixTimestamp = Math.floor(this.startDate.getTime() / 1000);

        await this.context.message.reply(
            `**${appConfig.NAME}** has been up for \`${this.uptime.formatted}\` (Since <t:${unixTimestamp}:F>)`,
        );
    }
    protected logExecution(): void {}
}
