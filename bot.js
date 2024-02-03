const { Client, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
    ],
  });

const token = process.env.BOT_TOKEN;
const guildId = process.env.GUILD_ID;
const voiceChannelId = process.env.SNEK_VOICECHAT_CHANNEL;
const textChannelId = process.env.SNEK_ANNOUNCEMENT_CHANNEL;

client.once('ready', () => {
  console.log('Bot is ready!');
});

client.on('voiceStateUpdate', (oldState, newState) => {
  const { member, channel } = newState;

  if (channel && channel.id === voiceChannelId) {
    const userName = member.user.username;
    const textChannel = client.channels.cache.get(textChannelId);

    textChannel.send(`${userName} est au Xoin!`);
  }
});

client.login(token);
