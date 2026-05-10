import { castNumberToTime, formatTime } from "../../utils/time";
import { Configs, type ConfigsResolver } from "../Configs";

export class AppFormatter {
    constructor(private readonly configs: ConfigsResolver = Configs) {}

    get formattedDelay(): string {
        const adjustedDelay = castNumberToTime(this.configs.app.COMMANDS.UNDELETE.DELAY_S, "s");
        return formatTime(adjustedDelay);
    }
}
