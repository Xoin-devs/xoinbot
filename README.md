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

Be sure Docker is running on the local environment.

Build the docker image and export it as a tar :

```shell
./deploy-on-prod.sh
```

The tar is located in `tmp/`. You can push it on the prod server using :

```shell
scp tmp/xoinbot.tar <USER>@<IP>:xoinbot
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
