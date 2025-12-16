import type { DataSource } from "typeorm";

import { dataSourceappConfig } from "../../db/dataSource";

export interface DatabaseResolver {
    get dataSource(): DataSource;
    reset(): void;
}

export class DatabaseContainer {
    private _dataSource?: DataSource;

    get dataSource(): DataSource {
        return (this._dataSource ??= dataSourceappConfig());
    }

    reset(): void {
        this._dataSource = undefined;
    }
}
