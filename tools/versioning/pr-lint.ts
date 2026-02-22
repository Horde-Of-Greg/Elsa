import * as core from "@actions/core";
import * as github from "@actions/github";

import { typesRegex } from "./types";

async function main() {
    try {
        const context = github.context;

        if (!context.payload.pull_request) {
            core.setFailed("Unexpected Error.");
            process.exit(1);
        }

        const prTitle: string = context.payload.pull_request.title;

        const match = prTitle.match(typesRegex);

        if (!match) {
            core.setFailed("Title of the PR is not correct. See CONTRIBUTING.md");
            process.exit(1);
        }

        core.info("PR title valid.");
        process.exit(0);
    } catch (err) {
        core.setFailed(`Error: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
    }
}

main().catch((err) => {
    core.setFailed(`Error: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
});
