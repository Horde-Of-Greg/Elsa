import { execSync } from "child_process";

export function compressWithZstd(inputPath: string, outputPath: string): void {
    execSync(`tar -cf - ${inputPath} | zstd -q --rm -o "${outputPath}.tar.zst"`);
}
