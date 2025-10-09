function getCommandName(cmdId: string | null): string | null {
    if (cmdId == null) {
        return null;
    }

    //TODO: Make this configurable
    const acceptedCmds = new Map<string, string[]>();
    acceptedCmds.set('add', ['a', 'add']);
    acceptedCmds.set('setRank', ['sr', 'set', 'setrank']);
    acceptedCmds.set('sendTag', ['t', 'tag', 'sendTag']);

    acceptedCmds.forEach((value, key) => {
        if (value.includes(cmdId)) {
            return key;
        }
    });

    return null;
}
