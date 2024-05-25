const { SlashCommandBuilder } = require("discord.js");

const { searchTenor } = require('../../../utils/tenor-utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("patoche")
        .setDescription(`Eh c'est Patoche!`),
    async execute(interaction) {
        const gif = await searchTenor("patrice le flambeau");
        await interaction.reply(gif);
    },
};
