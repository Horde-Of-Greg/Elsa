import type { GitHubCommitSHA } from "../types/github/commits.js";
import type { AcceptedBump, AcceptedTitleScope, ParsedTitle, TitleParam } from "../types/versioning/title.js";
import { getCommitMessage, getCommitSha } from "../utils/github/commits.js";
import { titleParams } from "./constants.js";
import { parseTitle } from "./title-parsing.js";

export async function lintCommit(
    sha?: GitHubCommitSHA,
): Promise<{ bumpType: AcceptedBump; scope: AcceptedTitleScope }> {
    const commitTitle: string = (await getCommitMessage(sha ?? getCommitSha())).split("\n")[0];

    const parsedTitle = parseTitle(commitTitle);
    const titleParam = titleParams[parsedTitle.type];

    const scope = getCommitTitleScope(parsedTitle, titleParam);
    const bumpType = getCommitBumpType(titleParam);

    return { bumpType, scope };
}

function getCommitTitleScope(parsedTitle: ParsedTitle, titleParam: TitleParam): AcceptedTitleScope {
    let scope: AcceptedTitleScope;

    if (titleParam.scopes === "any") {
        scope = parsedTitle.scope ?? "all";
    } else {
        if (titleParam.scopes !== parsedTitle.scope) {
            throw new Error("Invalid scope. See CONTRIBUTING.md");
        }
        scope = parsedTitle.scope;
    }

    return scope;
}

function getCommitBumpType(titleParam: TitleParam): AcceptedBump {
    return titleParam.bump ?? "none";
}
