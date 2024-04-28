#!/bin/bash

IMAGE_NAME="xoinbot"
IMAGE_TAG="1.0"

docker build --platform "linux/amd64"  -t "$IMAGE_NAME:$IMAGE_TAG" .

if [ -d tmp ];then 
	rm -rf tmp
fi

mkdir tmp

echo "${IMAGE_NAME}:${IMAGE_TAG}"

docker save -o ./tmp/xoinbot.tar "${IMAGE_NAME}:${IMAGE_TAG}"
