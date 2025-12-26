#!/usr/bin/env bash
set -euo pipefail

script_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd -- "$script_directory/../.."

if npx tsx tools/production/check-version-with-remote.ts; then
    echo "Updates available, pulling..."
    npm run production:pull
fi

npm start
