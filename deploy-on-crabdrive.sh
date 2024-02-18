#!/bin/bash

IMAGE_NAME="xoinbot"
IMAGE_TAG="1.0"
IMAGE_ARCH="linux/amd64"

docker build --platform "$IMAGE_ARCH" -t "$IMAGE_NAME:$IMAGE_TAG" .

mkdir tmp

docker save -o ./tmp/xoinbot.tar "$IMAGE_NAME:$IMAGE"

