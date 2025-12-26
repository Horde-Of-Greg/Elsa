module.exports = {
    apps: [
        {
            name: "elsa",
            script: "tools/production/start.sh",
            interpreter: "/bin/bash",
            cwd: ".",
            env: {
                NODE_ENV: "production",
            },
            exp_backoff_restart_delay: 100,
            max_restarts: 10,
            min_uptime: "10s",
        },
    ],
};
