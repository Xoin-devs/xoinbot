#!/bin/bash

if [ -n "$1" ]; then
	IMAGE_NAME=$1
else
	IMAGE_NAME="xoinbot"
fi
if [ -n "$2" ]; then
	IMAGE_TAG=$2
else
	IMAGE_TAG="1.0"
fi


docker build --platform "linux/amd64"  -t "$IMAGE_NAME:$IMAGE_TAG" .

if [ -d tmp ];then 
	rm -rf tmp
fi

mkdir tmp

echo "${IMAGE_NAME}:${IMAGE_TAG}"

docker save -o ./tmp/xoinbot.tar "${IMAGE_NAME}:${IMAGE_TAG}"

echo "Deploying new bot commands if needed :"
node utils/deploy-commands.js

echo "done"
