import * as core from "@actions/core";
import * as github from "@actions/github";

import { getCommitMessage } from "../../src/utils/github/commits.js";
import { type AcceptedBump, type AcceptedType, typesRegex } from "./types.js";

const outputName = "bump-type";

async function main() {
    try {
        const context = github.context;

        const sha = context.payload.after ?? context.sha;
        const commitTitle: string = (await getCommitMessage(sha)).split("\n")[0];

        const match = commitTitle.match(typesRegex);

        let type: AcceptedType;
        if (match) {
            type = match[1] as AcceptedType;
        } else {
            if (/\d+\.\d+\.\d+/.test(commitTitle)) {
                type = "CI";
            } else {
                core.setFailed("Title of the Commit is not Correct. See CONTRIBUTING.md");
                core.setOutput(outputName, "none");
                process.exit(1);
            }
        }

        let bumpType: AcceptedBump | "none";

        switch (type) {
            case "BREAK":
                bumpType = "major";
                break;
            case "FEAT":
                bumpType = "minor";
                break;
            case "FIX":
                bumpType = "patch";
                break;
            case "CI":
            case "DOCS":
            case "REFACTOR":
            case "STYLE":
            case "TEST":
                bumpType = "none";
                break;
        }

        core.info(`✅ Commit Message Valid. Bump Type: ${bumpType}`);
        core.setOutput(outputName, bumpType);
        process.exit(0);
    } catch (err) {
        core.setFailed(`Error: ${err instanceof Error ? err.message : String(err)}`);
        core.setOutput(outputName, "none");
        process.exit(1);
    }
}

main().catch((err) => {
    core.setFailed(`Error: ${err instanceof Error ? err.message : String(err)}`);
    core.setOutput(outputName, "none");
    process.exit(1);
});
