const { Client, GatewayIntentBits, Events, Collection } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();
const fs = require("node:fs");
const path = require("node:path");
const loadCommandsAtStart = require("./utils/load-commands-at-start");
const isStateChangeLegitimate = require("./utils/is-state-change-legitimate");

let today = new Date();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

let token = process.env.TEST_DISCORD_TOKEN;
let voiceChannelId = process.env.TEST_VOICECHAT_CHANNEL;
let textChannelId = process.env.TEST_ANNOUNCEMENT_CHANNEL;
if (!process.env.IN_TEST_ENVIRONMENT) {
    console.log("Starting in production mode");
    token = process.env.DISCORD_TOKEN;
    voiceChannelId = process.env.SNEK_VOICECHAT_CHANNEL;
    textChannelId = process.env.SNEK_ANNOUNCEMENT_CHANNEL;
}
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

async function getMembersCount(channel) {
    if (channel === null) return 0;
    const fetchedChannel = await channel.fetch(true);
    return fetchedChannel.members.size;
}

client.commands = new Collection();
loadCommandsAtStart(client);

client.on("voiceStateUpdate", async (oldState, newState) => {
    const { member, channel } = newState;

    const oldMembersCount = await getMembersCount(oldState.channel);
    const newMembersCount = await getMembersCount(newState.channel);

    if (!isStateChangeLegitimate(oldState, newState)) {
        today = new Date();
        console.log(`${today} - State change is not legitimate.`);
        return;
    }
    if (newMembersCount > 1) {
        today = new Date();
        console.log(
            `${today} - No need to announce : ${newMembersCount} members in the channel.`
        );
        return;
    }

    if (channel && channel.id === voiceChannelId) {
        today = new Date();
        const userName = member.user.username;
        const textChannel = client.channels.cache.get(textChannelId);

        console.log(`${today} - ${userName} is at the Xoin!`);
        textChannel.send(`${userName} ${getXoinMessage()}`);
    }
});

function getXoinMessage() {
  const dateTime = new Date();
  const hours = dateTime.getHours();
  const dayOfWeek = dateTime.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return " est au Xoin !";
  } else if (hours > 8 && hours < 19) {
    return " a posé sa journée !";
  } else if (hours <= 8) {
    return " ne va pas se lever demain parce qu'il est un gros chômeur !";
  } else {
    return " est au Xoin !";
  }
}

// generic handling of text commands
client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "yes") {
            await interaction.update({
                content: "C'est une micro-agression, je suis bicurieux",
                components: [],
            });
        } else if (interaction.customId === "no") {
            await interaction.update({
                content: "Non c'est pas raciste, c'est de l'humour",
                components: [],
            });
        }
        return;
    } else if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(
            `No command matching ${interaction.commandName} was found.`
        );
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    }
});

client.login(token);
