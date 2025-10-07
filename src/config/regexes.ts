export function isDiscordToken(textToTest: string): Boolean {
    // source: https://regex101.com/r/1GMR0y/1
    const regex: RegExp =
        /^(mfa\.[a-z0-9_-]{20,})|([a-z0-9_-]{23,28}\.[a-z0-9_-]{6,7}\.[a-z0-9_-]{27})$/gm;

    return regex.test(textToTest);
}
