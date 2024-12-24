const { Client, GatewayIntentBits, Events, Collection } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();
require('module-alias/register');
const loadCommandsAtStart = require("@utils/loadCommands");
const voiceStateUpdate = require('@services/events/voice/voiceStateUpdate');
const interactionCreate = require("@services/events/interaction/interactionCreate");

let today = new Date();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

let token = process.env.TEST_DISCORD_TOKEN;

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.commands = new Collection();
loadCommandsAtStart(client);

client.on('voiceStateUpdate', (oldState, newState) => voiceStateUpdate(client, oldState, newState));

// generic handling of text commands
client.on(Events.InteractionCreate, async (interaction) => interactionCreate(interaction));

client.login(token);
