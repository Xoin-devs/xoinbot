# XoinBot - Getting started

## Start XoinBot locally

Create a .env file at the root folder, containing the following values:

```config
DISCORD_TOKEN=TO_BE_DEFINED
APP_ID=TO_BE_DEFINED
PUBLIC_KEY=TO_BE_DEFINED
SERVER_ID=TO_BE_DEFINED
TENOR_KEY=TO_BE_DEFINED

SNEK_ANNOUNCEMENT_CHANNEL=TO_BE_DEFINED
SNEK_VOICECHAT_CHANNEL=TO_BE_DEFINED
```

Run the commands deployment script to update Discord about the used commands

```javascript
node utils/deploy-commands.js
```

*If the command isn't sent at the root of the project, it will not work, due to dotenv errors.*

Run the bot locally

```javascript
node bot.js
```

## Docker

### Deploy on prod

Make sure Docker is running on the local environment.

Make sure you are login with ghcr.io registries : 

```shell
docker login ghcr.io -u <GhUser> -p <PAT>
```

> Make sure the pat used is a **classic token**. Fine-grained tokens are not supported by Docker.

> If you don't know how to generate a PAT see informations [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

Build the docker image and export it as a tar :

```shell
./deploy-on-prod.sh -n ghcr.io/xoin-devs/xoinbot/<image_name> -t <image_tag>
```

Then open an ssh connection on the server hosting the bot and go into `~/xoinbot`:
You should have the last version of `xoinbot.tar`
Finally run :

```shell
./docker-run.sh
```

And you have the last version of the Xoinbot runnig.

### Local run

Build and start bot:

```shell
docker compose up --build -d
```

Run without build:

```shell
docker compose up -d
```

Stop bot:

```shell
docker compose down
```
