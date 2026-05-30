import { AppFormatter } from "../../config/formatters/AppFormatter";
import type { ConfigsResolver } from "../../types/config/config";
import type { FormatterContainerResolver } from "../../types/core/containers";

export class FormatterContainer implements FormatterContainerResolver {
    private _appFormatter?: AppFormatter;

    constructor(private readonly configs: ConfigsResolver) {}

    get app(): AppFormatter {
        return (this._appFormatter ??= new AppFormatter(this.configs));
    }

    reset(): void {
        this._appFormatter = undefined;
    }
}
