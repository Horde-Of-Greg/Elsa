#!/usr/bin/env bash
set -euo pipefail

script_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd -- "$script_directory"

git fetch origin
git checkout main
git reset --hard origin/main

npm ci
npm run build

npm run update_configs
