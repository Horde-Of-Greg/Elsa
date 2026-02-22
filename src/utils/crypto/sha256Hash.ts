import { createHash } from "node:crypto";

import type { SHA256Hash } from "../../types/crypto.js";

/**
 * Compute SHA-256 hash from a string.
 *
 * @param input - The string to hash
 * @returns A type-safe SHA-256 hash buffer
 */
export function computeSHA256(input: string): SHA256Hash {
    const hash = createHash("sha256").update(input).digest();
    return hash as SHA256Hash;
}

/**
 * Create a SHA-256 hash from an existing buffer.
 * Validates that the buffer is exactly 32 bytes (256 bits).
 *
 * @param buffer - A buffer that should be a SHA-256 hash
 * @returns A type-safe SHA-256 hash
 * @throws Error if buffer is not 32 bytes
 */
export function fromBuffer(buffer: Buffer): SHA256Hash {
    if (buffer.length !== 32) {
        throw new Error(`Invalid SHA-256 hash: expected 32 bytes, got ${buffer.length}`);
    }
    return buffer as SHA256Hash;
}

/**
 * Create a SHA-256 hash from a hex string.
 * Validates that the string is exactly 64 hex characters.
 *
 * @param hex - A hex string representing a SHA-256 hash
 * @returns A type-safe SHA-256 hash
 * @throws Error if hex string is invalid
 */
export function fromHex(hex: string): SHA256Hash {
    if (!/^[0-9a-fA-F]{64}$/.test(hex)) {
        throw new Error(`Invalid SHA-256 hex string: expected 64 hex characters, got "${hex}"`);
    }
    return Buffer.from(hex, "hex") as SHA256Hash;
}

/**
 * Convert SHA-256 hash to hex string.
 *
 * @param hash - The SHA-256 hash
 * @returns Hex string representation
 */
export function toHex(hash: SHA256Hash): string {
    return hash.toString("hex");
}

/**
 * Check if two SHA-256 hashes are equal.
 *
 * @param a - First hash
 * @param b - Second hash
 * @returns True if hashes are equal
 */
export function equals(a: SHA256Hash, b: SHA256Hash): boolean {
    return a.equals(b);
}
