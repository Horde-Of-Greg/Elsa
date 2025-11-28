import { PermLevel } from '../db/entities/UserHost';

export function getCommandName(cmdId: string | null): string | null {
    if (cmdId == null) {
        return null;
    }

    //TODO: Make this configurable
    const acceptedCmds = new Map<string, string[]>();
    acceptedCmds.set('add', ['a', 'add']);
    acceptedCmds.set('setRank', ['sr', 'set', 'setrank']);
    acceptedCmds.set('sendTag', ['t', 'tag', 'sendTag']);

    acceptedCmds.forEach((value, key) => {
        if (value.includes(cmdId.toLowerCase())) {
            return key;
        }
    });

    return null;
}

export function getRankEnum(rankId: string | null): PermLevel | null {
    if (rankId == null) {
        return null;
    }

    //TODO: Make this configurable
    const acceptedRanks = new Map<Number, string[]>();
    acceptedRanks.set(PermLevel.DEFAULT, ['default', 'non', '0']);
    acceptedRanks.set(PermLevel.TRUSTED, ['trusted', 'member', '1']);
    acceptedRanks.set(PermLevel.MOD, ['mod', 'moderator', '2']);
    acceptedRanks.set(PermLevel.ADMIN, ['admin', 'supermod', '3']);
    acceptedRanks.set(PermLevel.OWNER, ['owner', 'superadmin', '4', 'highest']);

    acceptedRanks.forEach((value, key) => {
        if (value.includes(rankId.toLowerCase())) {
            return key;
        }
    });

    return null;
}
