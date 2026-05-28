export function parseChoice<const Choices extends readonly string[]>(
    value: unknown,
    choices: Choices,
): asserts value is Choices[number] {
    if (typeof value !== "string" || !(choices as readonly string[]).includes(value)) {
        throw new Error(`Invalid value "${value}". Expected one of: ${choices.join(" | ")}`);
    }
}
