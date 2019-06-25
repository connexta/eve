#!/bin/bash

set -o nounset \
    -o errexit

if [ $# -ne 0 ]; then
  echo "Loading environment variables..."
  for var in "$@"; do
    export "$var"
  done
fi

echo "Building application..."
yarn build

echo "Starting application..."
yarn start --port 3000 --host 0.0.0.0 