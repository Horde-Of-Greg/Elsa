set -euo pipefail

script_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd -- "$script_directory/../.."

npx tsx tools/production/check-version-with-remote.ts
if [ $? -eq 1 ]; then
    echo "Updates available, pulling..."
    npm run production:pull
fi

npm start
