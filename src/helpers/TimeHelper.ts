/**
 * Helper class for various time related events.
 */
export class TimeHelper {
    /**
     * Get the timestamp using the Date class.
     * @returns The timestamp as an ISO string.
     */
    static getTimestampNow(): string {
        return new Date().toISOString();
    }

    /**
     * A simple method to make the code sleep for a set amount of time.
     * @param ms Time to sleep in milliseconds.
     * @returns A promise resolving in the specified time.
     */
    static async sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
