const { SlashCommandBuilder } = require("discord.js");

const { searchTenor } = require("../../../utils/tenor-utils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quizz")
        .setDescription(`Es-tu un vrai.e Français.e de la modernité ?`),
    async execute(interaction) {
        const json = require("../../data/macron_questions.json");
        const size = json.length;
        console.log(json);
        interaction.reply(`Qu'en penses-tu : ${json[Math.floor(Math.random() * size)].question}`);
    },
};
