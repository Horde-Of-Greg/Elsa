export async function fetchLatestRemoteTag(): Promise<string> {
    const response = await fetch("https://api.github.com/repos/horde-of-greg/elsa/tags");
    const tags = await ensureValidTagsResponse(response);
    const firstTag = ensureValidTag(tags[0]);

    return firstTag.name;
}

async function ensureValidTagsResponse(response: Response): Promise<unknown[]> {
    const tags: unknown = await response.json();

    if (!Array.isArray(tags)) {
        throw new Error(
            "Response from GitHub was invalid. Response is not an array, when an array was expected",
        );
    }

    return tags;
}

function ensureValidTag(tag: unknown): Record<"name", string> {
    if (typeof tag !== "object" || tag === null) {
        throw new Error(
            "Response from GitHub was invalid. Response is not an object, when an object was expected",
        );
    }

    if (!("name" in tag)) {
        throw new Error(
            "Response from GitHub was invalid. First tag in the response is missing the 'name' property",
        );
    }

    if (typeof tag.name !== "string") {
        throw new Error("Response from GitHub was invalid. Property 'name' in first tag is not a string");
    }

    return tag as Record<"name", string>;
}
