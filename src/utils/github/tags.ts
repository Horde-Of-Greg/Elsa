import { MalformedResponseError } from "../../errors/internal/http";

export async function fetchLatestRemoteTag(): Promise<string> {
    const response = await fetch("https://api.github.com/repos/horde-of-greg/elsa/tags");
    const tags = (await response.json()) as object[];
    const firstTag = tags[0];

    if (!("name" in firstTag)) {
        throw new MalformedResponseError({
            objectTested: "latest remote tag",
            source: "GitHub",
            failedCondition: "first tag is missing the 'name' property",
        });
    }

    if (typeof firstTag.name !== "string") {
        throw new MalformedResponseError({
            objectTested: "latest remote tag",
            source: "GitHub",
            failedCondition: "property 'name' in first tag is not a string",
        });
    }

    return firstTag.name;
}
