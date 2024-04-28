const { SlashCommandBuilder } = require("discord.js");

const { searchTenor } = require('../../../utils/tenor-utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drift")
    .setDescription(`Quand tu pars en couscous merguez`),
  async execute(interaction) {
    const gif = await searchTenor("drift");
    await interaction.reply(gif);
  },
};
