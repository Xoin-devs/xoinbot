const { Client, GatewayIntentBits, Events, Collection } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();
const fs = require('node:fs');
const path = require('node:path');
const loadCommandsAtStart = require("./utils/load-commands-at-start");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

const token = process.env.DISCORD_TOKEN;
const guildId = process.env.GUILD_ID;
const voiceChannelId = process.env.SNEK_VOICECHAT_CHANNEL;
const textChannelId = process.env.SNEK_ANNOUNCEMENT_CHANNEL;

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.commands = new Collection();
loadCommandsAtStart(client);

client.on("voiceStateUpdate", (oldState, newState) => {
  const { member, channel } = newState;

  if (channel && channel.id === voiceChannelId) {
    const userName = member.user.username;
    const textChannel = client.channels.cache.get(textChannelId);

    textChannel.send(`${userName} est au Xoin!`);
  }
});

// generic handling of text commands
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
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