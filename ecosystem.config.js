module.exports = {
    apps: [
        {
            name: "elsa",
            script: "./dist/start.js",
            cwd: ".",
            env: {
                NODE_ENV: "production",
            },
            exp_backoff_restart_delay: 100,
            max_restarts: 10,
            min_uptime: "10s",
            watch: ["dist"],
            kill_timeout: 5000, //allow time for shutdown to happen
        },
    ],
};
