import * as core from "@actions/core";
import * as github from "@actions/github";

import { type PullRequestContext, type PullRequestTask } from "../types/github/pull-requests.js";
import { assertPullRequestContext } from "../utils/types/assertions.js";
import { isValidTitle } from "./title-parsing.js";

export function lintPr(): void {
    const context = github.context;
    assertPullRequestContext(context);

    const tasks: PullRequestTask[] = [lintPrTitle];

    for (const task of tasks) {
        task(context);
    }
}

function lintPrTitle(context: PullRequestContext): void {
    const prTitle = context.payload.pull_request.title as string;
    const isValid = isValidTitle(prTitle);

    if (!isValid) {
        core.setFailed(
            "Title of the PR is not correct. Expected format: `[<TYPE>] (<scope: optional>): <message>. More info in CONTRIBUTING.md`",
        );
        process.exit(1);
    }
}
