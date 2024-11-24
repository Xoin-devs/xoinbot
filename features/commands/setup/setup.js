const { SlashCommandBuilder } = require("discord.js");


// TODO : 
// Add labels for notifications (notifications_strings)
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
    console.log("interaction", interaction.options);
    await interaction.reply({ content: 'Your ChannelChime 🪶 is now set up!', ephemeral: true });
  },
};
