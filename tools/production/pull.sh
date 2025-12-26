#!/usr/bin/env bash
set -euo pipefail

script_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd -- "$script_directory/../.."

git fetch origin
git checkout main
echo "WARNING: Resetting to origin/main, local changes will be lost. Ctrl + C to cancel."
echo "Resetting in 3..."
sleep(1000)
echo "2..."
sleep(1000)
echo "1..."
sleep(1000)
git reset --hard origin/main

echo "Installing dependencies..."
npm ci || { echo "npm ci failed"; exit 1; }

echo "Building..."
npm run build || { echo "Build failed"; exit 1; }

npm run production:update-configs
