const { SlashCommandBuilder } = require("discord.js");

const { searchTenor } = require('../../../utils/tenor-utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("flambeau")
        .setDescription(`Le Flambeau`),
    async execute(interaction) {
        const gif = await searchTenor("le flambeau");
        await interaction.reply(gif);
    },
};
