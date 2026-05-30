import { execSync } from "node:child_process";

export function compressWithZstd(inputPath: string, outputPath: string): void {
    execSync(`tar -cf - ${inputPath} | zstd -q -o "${outputPath}.tar.zst"`);
}
