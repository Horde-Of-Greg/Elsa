export function isDiscordToken(textToTest: string): Boolean {
    const regex: RegExp = /^[a-z0-9\+\/\-]*\.[a-z0-9\+\/\-]*\.[a-z0-9\+\/\-]*$/i;

    return regex.test(textToTest);
}
