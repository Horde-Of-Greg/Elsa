export async function fetchLatestRemoteTag(): Promise<string> {
    const response = await fetch("https://api.github.com/repos/horde-of-greg/elsa/tags");
    const tags = await response.json();
    return tags[0].name;
}
