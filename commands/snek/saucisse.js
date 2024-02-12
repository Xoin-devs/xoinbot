const { SlashCommandBuilder } = require("discord.js");

const { searchTenor } = require('../../utils/tenor-utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("saucisse")
    .setDescription(`Si t'es tombé sur un voile-vapeur`),
  async execute(interaction) {
    const gif = await searchTenor("sausage");
    await interaction.reply(gif);
  },
};
