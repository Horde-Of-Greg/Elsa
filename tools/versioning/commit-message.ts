import type { AcceptedProject } from "../types/versioning/projects.js";
import { capitalize } from "../utils/stringFormat.js";

export function createBumpCommitMessage(newVersions: Partial<Record<AcceptedProject, string>>): string {
    if (newVersions.elsa === undefined && newVersions.tools === undefined) {
        throw new Error("Tried to create a bump commit message with both fields being empty.");
    }

    const messages = [];
    for (const [project, newVersion] of Object.entries(newVersions)) {
        messages.push(`${capitalize(project)} to ${newVersion}`);
    }

    return `[AUTO]: Bump ${messages.join(" & ")}`;
}
