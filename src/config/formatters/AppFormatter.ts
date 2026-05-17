import type { ConfigsResolver } from "../../types/config/config";
import { castNumberToTime, formatTime } from "../../utils/time";

export class AppFormatter {
    constructor(private readonly configs: ConfigsResolver) {}

    get formattedDelay(): string {
        const adjustedDelay = castNumberToTime(this.configs.app.COMMANDS.UNDELETE.DELAY_S, "s");
        return formatTime(adjustedDelay);
    }
}
