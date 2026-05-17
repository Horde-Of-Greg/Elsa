import type { DataSource } from "typeorm";

import { dataSource } from "../../db/dataSource";
import type { ConfigsResolver } from "../../types/config/config";
import type { DatabaseContainerResolver } from "../../types/core/containers";

export class DatabaseContainer implements DatabaseContainerResolver {
    private _dataSource?: DataSource;

    constructor(private readonly configs: ConfigsResolver) {}

    get dataSource(): DataSource {
        return (this._dataSource ??= dataSource(this.configs));
    }

    reset(): void {
        this._dataSource = undefined;
    }
}
