export async function fetchLatestRemoteTag(): Promise<string> {
    const response = await fetch("https://api.github.com/repos/horde-of-greg/elsa/tags");
    const tags = (await response.json()) as object[];
    const firstTag = tags[0];

    if (!("name" in firstTag)) {
        throw new Error(
            "Could not fetch latest remote tag from GitHub properly; missing 'name' property from the first tag.",
        );
    }

    if (typeof firstTag.name !== "string") {
        throw new Error(
            "Could not fetch latest remote tag from GitHub properly; first tag name is not a string.",
        );
    }

    return firstTag.name;
}
