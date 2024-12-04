const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { addNewGuild } = require('../../modules/database');
let { announcementChannelId, guildId, vocalChannelId } = require('../../services/state');

// TODO : 
// Add labels for notifications (notifications_strings)
// Filter on allowed channels (depending on bot's roles)
// If announcement channel got deleted, the bot crash
// Announce the username, not the ID

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription(`Setup the ChannelChime bot`)
    .addChannelOption(option =>
      option.setName("vocal_channel_id")
        .setDescription("The ID of the vocal channel to watch 🪶")
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true)
    )
    .addChannelOption(option =>
      option.setName("announcement_channel_id")
        .setDescription("The ID of the channel where ChannelChime 🪶 will alert")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
  ,
  async execute(interaction) {
    announcementChannelId = interaction.options.getChannel('announcement_channel_id').id;
    vocalChannelId = interaction.options.getChannel('vocal_channel_id').id;
    addNewGuild(interaction.guildId, announcementChannelId, vocalChannelId);
    guildId = interaction.guildId;
    await interaction.reply({ content: 'Your ChannelChime 🪶 is now set up!', ephemeral: true });
  },
};
