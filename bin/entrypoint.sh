#! /bin/bash

project_root=$(dirname $(dirname $(realpath $0 )))

node "$project_root/src/modules/shared/infrastructure/database/sync.js"

npx sequelize-cli db:migrate

if [[ $NODE_ENV == "production" ]]; then
  output=$(npx sequelize-cli db:seed --seed 20230729235053-default-admin-user.js 2>&1)

  sequelize_seed_exit_status=$?

  if [ $sequelize_seed_exit_status -ne 0 ]; then
    echo "Error encountered: $output"
    echo "Continuing with script execution despite error..."
  else
    echo "Sequelize seed successful"
  fi

  node "$project_root/build/index.js"
else
  npx sequelize-cli db:seed:all

  npm run dev
fi