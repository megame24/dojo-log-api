#! /bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

project_root=$(dirname $(dirname $(realpath $0 )))

node "$project_root/src/modules/shared/infrastructure/database/sync.js"

npx sequelize-cli db:migrate

if [[ $NODE_ENV == "production" ]]
then
  node "$project_root/build/index.js"
else
  npx sequelize-cli db:seed:all

  npm run dev
fi