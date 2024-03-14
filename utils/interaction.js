module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            // Checks if the interaction is a command and runs the `
            const command = client.command.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: "There was an error while executing action",
                });
            }

            console.log(
                `${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`
            );
            return;
        } else if (interaction.isButton()) {
            // Checks if the interaction is a button
            interaction.reply("you clicked" + interaction.customId);
            console.log(interaction);

            if (interaction.customId === "offense") {
                // Check for the customId of the button
                console.log(
                    `${interaction.user.tag} in #${interaction.channel.name} clicked the offense button.`
                );

                const ActionRow = new MessageActionRow().setComponents(
                    new MessageButton() // Create the button inside of an action Row
                        .setCustomId("CustomId")
                        .setLabel("Label")
                        .setStyle("PRIMARY")
                );

                return interaction.update({
                    // update the interaction with the new action row
                    content: "Hey",
                    components: [ActionRow],
                    ephemeral: true,
                });
            }
        }
    },
};
