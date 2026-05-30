import z from "zod";

import type { ParsedTitle } from "../types/versioning/title.js";
import {
    makeAcceptedTitleScope,
    makeAcceptedTitleType,
} from "../utils/types/constructors/versioning/title.js";

const titlePattern = /\[(?<type>[A-Z]+)\] (?:\((?<scope>[a-z]+)\) )?(?<message>.+)/;

export function isValidTitle(title: string): boolean {
    return titlePattern.test(title);
}

export function parseTitle(title: string): ParsedTitle {
    const match = titlePattern.exec(title);

    const validator = z.object({
        type: z.string().transform(makeAcceptedTitleType),
        scope: z.string().transform(makeAcceptedTitleScope).optional(),
        message: z.string(),
    });

    return validator.parse(match?.groups);
}
