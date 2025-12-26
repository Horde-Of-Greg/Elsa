/* eslint-disable no-console */
async function check() {
    const hereVersion = process.version;
    const thereVersion = (await fetchLatestRemoteTag()).replace(/^v/, "");
    if (hereVersion === thereVersion) {
        process.exit(0);
    }
    process.exit(1);
}

async function fetchLatestRemoteTag(): Promise<string> {
    const response = await fetch("https://api.github.com/repos/horde-of-greg/elsa/tags");
    const tags = await response.json();
    return tags[0].name;
}

check().catch((err) => {
    console.error("Failed to check version:", err);
    process.exit(2); // Different exit code for errors vs "needs update"
});
