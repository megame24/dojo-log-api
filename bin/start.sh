#! /bin/bash

read -p "Build image? Y/N (press enter for No): " BUILD_IMAGE

if [[ $BUILD_IMAGE == [yY] || $BUILD_IMAGE == [yY][eE][sS] ]]
then
  docker compose build
fi

docker compose up -d
