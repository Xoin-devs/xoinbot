#!/bin/bash

function usage {
	echo "Usage: $0 -n [image_name] -t [image_tag]"
	echo "  -n | --name image_name: the name of the image to build"
	echo "  -t | --tag image_tag: the tag of the image to build"
	echo "  -h | --help: display this help"
}

while [ "$1" != "" ]; do
	case $1 in
		-n | --name )           shift
								IMAGE_NAME=$1
								;;
		-t | --tag )            shift
								IMAGE_TAG=$1
								;;
		-h | --help )           usage
								exit
								;;
		* )                     usage
								exit 1
	esac
	shift
done

if [ -z "$IMAGE_NAME" ] || [ -z "$IMAGE_TAG" ]; then
	usage
	exit 1
fi

npm install --production

docker build --platform "linux/amd64"  -t "$IMAGE_NAME:$IMAGE_TAG" .

if [ -d tmp ];then 
	rm -rf tmp
fi

mkdir tmp

echo "${IMAGE_NAME}:${IMAGE_TAG}"

docker save -o ./tmp/channelchime.tar "${IMAGE_NAME}:${IMAGE_TAG}"

echo "Deploying new bot commands if needed :"
node utils/deploy-commands.js

echo "done"
