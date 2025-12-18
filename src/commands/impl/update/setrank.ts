import { PermLevel } from "../../../db/entities/UserHost";
import { CommandDef, CommandInstance } from "../../Command";

export class CommandSetRankDef extends CommandDef<void, CommandSetRankInstance> {
    constructor() {
        super(
            {
                name: "setrank",
                aliases: ["sr", "srank"],
                permLevelRequired: PermLevel.OWNER,
                cooldowns: {
                    channel: -1,
                    guild: -1,
                },
                info: {
                    description: "Edits the rank of someone",
                    //TODO: Impl
                },
            },
            CommandSetRankInstance,
            {
                useCache: false,
            },
        );
    }
}

class CommandSetRankInstance extends CommandInstance<void> {
    protected async validateData(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    protected execute(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    protected reply(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    protected logExecution(): void {}
}
