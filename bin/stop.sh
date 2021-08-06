#! /bin/bash

read -p "Remove containers? (n/y): " REMOVE_CONTAINERS

if [[ $REMOVE_CONTAINERS == [yY] || $REMOVE_CONTAINERS == [yY][eE][sS] ]]
then
  docker-compose down
else
  docker-compose stop
fi