import assert from 'assert';
import { config } from '../config/config';

export type ParsedMessage = {
    prefix: string;
    command: string | null;
    server: string | null;

    tag: string | null;
    args: Array<string> | null;
};

export function parseMessage(messageText: string): ParsedMessage {
    const rawTester = `^${config.PREFIX}([a-z0-9]+)`;
    const tester: RegExp = new RegExp(rawTester, 'i');

    if (!tester.test(messageText)) {
        throw new Error('Could not parse message');
    }

    const rawMatcher: string = `^(${config.PREFIX})([a-z0-9]+)(-([a-z0-9]*))?(\s(\w+))?(\s([\w\s]+))?`;
    const matcher: RegExp = new RegExp(rawMatcher, 'gi');

    const parsed = messageText.match(matcher);
    assert(parsed, 'error during parsing');

    const parsedMessage: ParsedMessage = {
        prefix: parsed[0],
        command: parsed[1],
        server: parsed[3],
        tag: parsed[5],
        args: parsed.slice(7),
    };

    return parsedMessage;
}
