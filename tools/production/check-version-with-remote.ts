const hereVersion = process.version;
const thereVersion = fetchLatestRemoteTag();

async function check() {
    const hereVersion = process.version;
    const thereVersion = await fetchLatestRemoteTag();
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
