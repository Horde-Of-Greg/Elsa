import { dependencies } from "../../core/Dependencies";
import { castNumberToTime, formatTime } from "../../utils/time";
import type { ConfigResolver } from "./../../core/containers/Config";
export class AppFormatter {
    constructor(private readonly configs: ConfigResolver = dependencies.config) {}

    get formattedDelay(): string {
        const adjustedDelay = castNumberToTime(this.configs.app.COMMANDS.UNDELETE.DELAY_S, "s");
        return formatTime(adjustedDelay);
    }
}
