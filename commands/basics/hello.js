const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Says hello back!"),
  async execute(interaction) {
    await interaction.reply("Hello!");
  },
};
