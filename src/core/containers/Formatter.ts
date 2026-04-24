import { AppFormatter } from "../../config/formatters/AppFormatter";

export interface FormatterResolver {
    app: AppFormatter;
    reset(): void;
}

export class FormatterContainer implements FormatterResolver {
    private _appFormatter?: AppFormatter;

    get app(): AppFormatter {
        return (this._appFormatter ??= new AppFormatter());
    }

    reset(): void {
        this._appFormatter = undefined;
    }
}
