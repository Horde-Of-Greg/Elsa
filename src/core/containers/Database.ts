import type { DataSource } from "typeorm";

import { dataSourceAppConfig } from "../../db/dataSource";

export interface DatabaseResolver {
    get dataSource(): DataSource;
    reset(): void;
}

export class DatabaseContainer {
    private _dataSource?: DataSource;

    get dataSource(): DataSource {
        return (this._dataSource ??= dataSourceAppConfig);
    }

    reset(): void {
        this._dataSource = undefined;
    }
}
