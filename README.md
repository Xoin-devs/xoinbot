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

### Validate my build

You can test if your build is working by publishing a snapshot in your pull request using the label `build`

> If you want to re-build, you will have to remove and re-put the label

### Deploy on prod

Make sure Docker is running on the local environment.

Make sure you are login with ghcr.io registries : 

```shell
docker login ghcr.io -u <GhUser> -p <PAT>
```

> Make sure the pat used is a **classic token**. Fine-grained tokens are not supported by Docker.

> If you don't know how to generate a PAT see informations [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

To deploy the new version, you just have to create a new tag and it will be automatically deployed.

> You can also deploy from a pull request to test your image using the label `force deploy`

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
