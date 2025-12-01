#!/usr/bin/env node
require('dotenv').config();
const { execSync } = require('child_process');
const readline = require('readline');

const user = process.env.POSTGRES_USER;
const host = process.env.POSTGRES_HOST;
const db = process.env.POSTGRES_DB;
const environment = process.env.ENVIRONMENT;

if (!user || !host || !db || !environment) {
    console.error('Error: Missing database configuration in .env file');
    process.exit(1);
}

if (environment !== 'development') {
    process.exit(1);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log(`WARNING: This will DELETE ALL DATA in database: ${db}`);
rl.question('Are you sure you want to continue? (y/n): ', (answer) => {
    rl.close();

    if (!/^y(?:es)?$/i.test(answer.toLowerCase())) {
        console.log('Operation cancelled');
        process.exit(0);
    }

    console.log(`Resetting database: ${db}`);

    try {
        console.log('Dropping existing database...');
        execSync(`psql -U ${user} -h ${host} -d postgres -c "DROP DATABASE IF EXISTS ${db}"`, {
            stdio: 'inherit',
        });

        console.log('Creating new database...');
        execSync(`psql -U ${user} -h ${host} -d postgres -c "CREATE DATABASE ${db}"`, {
            stdio: 'inherit',
        });

        console.log('✓ Database reset successfully');
    } catch (error) {
        console.error('✗ Failed to reset database');
        process.exit(1);
    }
});
