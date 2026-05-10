import { MalformedResponseError } from "../../errors/internal/http";

export async function fetchLatestRemoteTag(): Promise<string> {
    const response = await fetch("https://api.github.com/repos/horde-of-greg/elsa/tags");
    const tags = await validTagsResponseGuardCheck(response);
    const firstTag = validTagGuardCheck(tags[0]);

    return firstTag.name;
}

async function validTagsResponseGuardCheck(response: Response): Promise<unknown[]> {
    const tags: unknown = await response.json();

    if (!Array.isArray(tags)) {
        throw new MalformedResponseError({
            objectTested: "github response",
            source: "GitHub",
            failedCondition: "response is not an array",
        });
    }

    return tags;
}

function validTagGuardCheck(tag: unknown): Record<"name", string> {
    const objectTested = "latest remote tag";
    const source = "GitHub";

    if (typeof tag !== "object" || tag === null) {
        throw new MalformedResponseError({
            objectTested,
            source,
            failedCondition: "first tag is not an object",
        });
    }

    if (!("name" in tag)) {
        throw new MalformedResponseError({
            objectTested,
            source,
            failedCondition: "first tag is missing the 'name' property",
        });
    }

    if (typeof tag.name !== "string") {
        throw new MalformedResponseError({
            objectTested,
            source,
            failedCondition: "property 'name' in first tag is not a string",
        });
    }

    return tag as Record<"name", string>;
}
