export function isDiscordToken(textToTest: string): boolean {
    const regex: RegExp = /^[a-z0-9+/\-_]+\.[a-z0-9+/\-_]+\.[a-z0-9+/\-_]+$/i;

    return regex.test(textToTest);
}
