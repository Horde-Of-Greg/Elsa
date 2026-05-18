import type { DependenciesResolver } from "../types/core/dependencies";
import type { CommandDef, CommandInstance } from "./Command";
import { CommandAddDef } from "./impl/create/add";
import { CommandAliasDef } from "./impl/create/alias";
import { CommandDeleteDef } from "./impl/delete/delete";
import { CommandUndeleteDef } from "./impl/delete/undelete";
import { CommandHelpDef } from "./impl/read/help";
import { CommandOwnerDef } from "./impl/read/owner";
import { CommandPingDef } from "./impl/read/ping";
import { CommandTagDef } from "./impl/read/tag";
import { CommandUptimeDef } from "./impl/read/uptime";
import { CommandVersionDef } from "./impl/read/version";
import { CommandEditDef } from "./impl/update/edit";
import { CommandSetRankDef } from "./impl/update/setrank";

export class Commands {
    private _add?: CommandAddDef;
    private _list?: CommandHelpDef;
    private _owner?: CommandOwnerDef;
    private _ping?: CommandPingDef;
    private _tag?: CommandTagDef;
    private _uptime?: CommandUptimeDef;
    private _edit?: CommandEditDef;
    private _setRank?: CommandSetRankDef;
    private _delete?: CommandDeleteDef;
    private _alias?: CommandAliasDef;
    private _version?: CommandVersionDef;
    private _undelete?: CommandUndeleteDef;

    constructor(private readonly dependencies: DependenciesResolver) {}

    get add(): CommandAddDef {
        return (this._add ??= new CommandAddDef(this.dependencies, this));
    }

    get help(): CommandHelpDef {
        return (this._list ??= new CommandHelpDef(this.dependencies, this));
    }

    get owner(): CommandOwnerDef {
        return (this._owner ??= new CommandOwnerDef(this.dependencies, this));
    }

    get ping(): CommandPingDef {
        return (this._ping ??= new CommandPingDef(this.dependencies, this));
    }

    get tag(): CommandTagDef {
        return (this._tag ??= new CommandTagDef(this.dependencies, this));
    }

    get uptime(): CommandUptimeDef {
        return (this._uptime ??= new CommandUptimeDef(this.dependencies, this));
    }

    get edit(): CommandEditDef {
        return (this._edit ??= new CommandEditDef(this.dependencies, this));
    }

    get setRank(): CommandSetRankDef {
        return (this._setRank ??= new CommandSetRankDef(this.dependencies, this));
    }

    get delete(): CommandDeleteDef {
        return (this._delete ??= new CommandDeleteDef(this.dependencies, this));
    }

    get alias(): CommandAliasDef {
        return (this._alias ??= new CommandAliasDef(this.dependencies, this));
    }

    get version(): CommandVersionDef {
        return (this._version ??= new CommandVersionDef(this.dependencies, this));
    }

    get undelete(): CommandUndeleteDef {
        return (this._undelete ??= new CommandUndeleteDef(this.dependencies, this));
    }

    get allCommands(): CommandDef<unknown, CommandInstance<unknown>>[] {
        return [
            this.add,
            this.help,
            this.owner,
            this.ping,
            this.tag,
            this.uptime,
            this.edit,
            this.setRank,
            this.delete,
            this.alias,
            this.version,
            this.undelete,
        ] as CommandDef<unknown, CommandInstance<unknown>>[];
    }
}
