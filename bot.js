const { Client, GatewayIntentBits, Events, Collection } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();
const fs = require("node:fs");
const path = require("node:path");
const loadCommandsAtStart = require("./utils/load-commands-at-start");
const isStateChangeLegitimate = require("./utils/is-state-change-legitimate");
let { announcementChannelId, vocalChannelId } = require('./services/state');
const { getChannelsByGuild } = require('./modules/database');

let today = new Date();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

let token = process.env.TEST_DISCORD_TOKEN;

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

    // check on channel to avoid error when ppl disconnect
    if (channel) {
        let result = await getChannelsByGuild(channel.guild.id);
        announcementChannelId = result["announcementId"];
        vocalChannelId = result["vocalChannelId"];
        if (channel && channel.id === vocalChannelId) {
            today = new Date();
            const userName = member.user.username;
            const textChannel = client.channels.cache.get(announcementChannelId);

            console.log(`${today} - ${userName} is at the Xoin!`);
            textChannel.send(`${userName} est au Xoin!`);
        }
    }
});

// generic handling of text commands
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

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
