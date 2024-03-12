const { SlashCommandBuilder } = require("discord.js");

const { searchTenor } = require('../../../utils/tenor-utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("marmotte")
    .setDescription(`Quand c'est l'heure de la marmotte`),
  async execute(interaction) {
    const gif = await searchTenor("groundhog");
    await interaction.reply(gif);
  },
};
