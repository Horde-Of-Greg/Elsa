import type { GitHubHeaders, GitHubHeadersFields } from "../../../../types/github/url.js";

export function makeGitHubHeaders<Value extends GitHubHeadersFields>(headers: Value): GitHubHeaders<Value> {
    return headers as GitHubHeaders<Value>;
}
