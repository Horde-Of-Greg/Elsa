export function requireActionsEnv() {
    if (process.env.ENVIRONMENT !== "actions") {
        // eslint-disable-next-line no-console
        console.error('Tried to run an actions script inside a dev other than "actions".');
        process.exit(1);
    }
}
