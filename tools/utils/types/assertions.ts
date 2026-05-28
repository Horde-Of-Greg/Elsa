import type { GitHubContext } from "../../types/github/context.js";
import type { PullRequestContext } from "../../types/github/pull-requests.js";

export function assertDefined<T>(mayNotExist?: T): asserts mayNotExist is T {
    if (mayNotExist === undefined) {
        throw new Error("Received an undefined variable where a defined variable was expected.");
    }
}

export function assertPullRequestContext(context: GitHubContext): asserts context is PullRequestContext {
    if (context.payload.pull_request === undefined) {
        throw new Error("Context does not include a pull request payload.");
    }
}
