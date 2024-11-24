const { SlashCommandBuilder } = require("discord.js");
const { addNewGuild } = require('../../modules/database');
let { announcementChannelId, guildId, vocalChannelId } = require('../../services/state');

// TODO : 
// Add labels for notifications (notifications_strings)
// Add SQLite database
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription(`Setup the ChannelChime bot`)
    .addStringOption(option =>
      option.setName("vocal_channel_id")
        .setDescription("The ID of the vocal channel to watch 🪶")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("announcement_channel_id")
        .setDescription("The ID of the channel where ChannelChime 🪶 will alert")
        .setRequired(true)
    )
  ,
  async execute(interaction) {
    addNewGuild(interaction.guildId, interaction.options.getString('announcement_channel_id'), interaction.options.getString('vocal_channel_id'));
    announcementChannelId = interaction.options.getString('announcement_channel_id');
    vocalChannelId = interaction.options.getString('vocal_channel_id');
    guildId = interaction.guildId;
    await interaction.reply({ content: 'Your ChannelChime 🪶 is now set up!', ephemeral: true });
  },
};
