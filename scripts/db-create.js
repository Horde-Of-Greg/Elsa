#!/usr/bin/env node
require('dotenv').config();
const { execSync } = require('child_process');

const user = process.env.POSTGRES_USER;
const host = process.env.POSTGRES_HOST;
const db = process.env.POSTGRES_DB;

if (!user || !host || !db) {
    console.error('Error: Missing database configuration in .env file');
    process.exit(1);
}

console.log(`Creating database: ${db}`);

try {
    execSync(`psql -U ${user} -h ${host} -d postgres -c "CREATE DATABASE ${db}"`, {
        stdio: 'inherit',
    });
    console.log('✓ Database created successfully');
} catch (error) {
    console.error('✗ Failed to create database');
    process.exit(1);
}
