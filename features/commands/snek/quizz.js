const { SlashCommandBuilder, ButtonBuilder } = require("discord.js");
const { ActionRowBuilder, MessageButton, MessageEmbed } = require("discord.js");

const { searchTenor } = require("../../../utils/tenor-utils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quizz")
        .setDescription(`Es-tu un vrai.e Français.e de la modernité ?`),
    async execute(interaction) {
        const json = require("../../data/macron_questions.json");
        const size = json.length;
        console.log(json);

        const row = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
                .setCustomId("yes")
                .setLabel("C'est une micro-agression, je suis bicurieux")
                .setStyle("Success"),
            new ButtonBuilder()
                .setCustomId("no")
                .setLabel("Non c'est pas raciste, c'est de l'humour")
                .setStyle("Danger")
        );

        interaction.reply({
            components: [row],
            content: `Qu'en penses-tu : \`${
                json[Math.floor(Math.random() * size)].question
            }\``,
        });
    },
};
