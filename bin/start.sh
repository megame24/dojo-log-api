#! /bin/bash

read -p "Build image? (n/y): " BUILD_IMAGE

if [[ $BUILD_IMAGE == [yY] || $BUILD_IMAGE == [yY][eE][sS] ]]
then
  docker-compose build
fi

docker-compose up -d

if [[ $BUILD_IMAGE != [yY] && $BUILD_IMAGE != [yY][eE][sS] ]]
then
  echo "Installing npm packages..."
  docker exec dojo_log_api bash -c "npm i"
fi
