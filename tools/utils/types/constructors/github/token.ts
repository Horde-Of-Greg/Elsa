import type { GitHubToken } from "../../../../types/github/token.js";

export function makeGithubToken<Value extends string>(token: Value): GitHubToken<Value> {
    return token as GitHubToken<Value>;
}
