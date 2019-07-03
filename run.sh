#!/bin/sh

set -o nounset \
    -o errexit

if [ $# -ne 0 ]; then
  echo "Loding environment varibles..."
  for var in "$@"
  do
    export "$var"
  done
fi

echo "Building application..."
echo Y | yarn build

echo "Starting application..."
yarn start 