const { SlashCommandBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");

/**
 * Constants for configuration values and string literals
 */
// Structure grouping all button-related constants
const BUTTON = {
    TYPES: {
        YES: {
            ID: 'yes',
            LABEL: 'Bah c\'est évident !',
            STYLE: 'Success',
            COLOR: 0x00FF00 // GREEN
        },
        MAYBE: {
            ID: 'maybe',
            LABEL: 'Joker! je suis une personne de gauche',
            STYLE: 'Secondary',
            COLOR: 0x808080 // GREY
        },
        NO: {
            ID: 'no',
            LABEL: 'C\'est une micro-agression, je suis bicurieux',
            STYLE: 'Danger',
            COLOR: 0xFF0000 // RED
        }
    },
};

// Constants for timeouts
const RESPONSE_TIMEOUT_MS = 30000; // 30 seconds

// Constants for UI text elements
const UI_TEXT = {
    QUIZ_ANSWER_TITLE: 'Résultat du Quizz',
    QUIZ_ANSWER_PREFIX: 'Question : ',
    QUIZ_FOOTER: 'Quiz du mâle alpha',
    QUESTION_PREFIX: 'Qu\'en penses-tu : ',
    TIMEOUT_MESSAGE: 'Le temps est écoulé, tu n\'as pas répondu à temps !',
    RESPONSE_TITLE: 'Ta réponse',
    COMMAND_DESCRIPTION: 'Es-tu un buveur de Kérosène?'
};

/**
 * Configuration for quiz responses and reactions
 */
const RESPONSES = {
    TRAP_TRIGGERED: {
        message: "Ah, le gros pd, ca prend des doigts dans le pétou!",
        emoji: "😂"
    },    DEFAULT: {
        [BUTTON.TYPES.YES.ID]: "Ca c'est un Alpha qui mange des pneux !",
        [BUTTON.TYPES.MAYBE.ID]: "Ca porte pas ses couilles, mais c'est pas grave.",
        [BUTTON.TYPES.NO.ID]: "AHAH le micro-agressé, tu vas pleurer dans ta chambre ?"
    }
};

/**
 * Main module for the quiz command
 */
module.exports = {    data: new SlashCommandBuilder()
        .setName("quizz")
        .setDescription(UI_TEXT.COMMAND_DESCRIPTION),

    /**
     * Executes the quiz command
     * @param {CommandInteraction} interaction - The triggered Discord interaction
     */
    async execute(interaction) {
        const questions = require("../../data/macron_questions.json");
        const randomIndex = Math.floor(Math.random() * questions.length);
        const selectedQuestion = questions[randomIndex];
          
        // Store the current question data in command metadata
        const currentQuestionData = {
            question: selectedQuestion.question,
            answer: selectedQuestion.answer,
            isTrick: selectedQuestion.trick || false
        };        
        
        // Create buttons for response options
        const row = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
                .setCustomId(BUTTON.TYPES.YES.ID)
                .setLabel(BUTTON.TYPES.YES.LABEL)
                .setStyle(BUTTON.TYPES.YES.STYLE),
            new ButtonBuilder()
                .setCustomId(BUTTON.TYPES.MAYBE.ID)
                .setLabel(BUTTON.TYPES.MAYBE.LABEL)
                .setStyle(BUTTON.TYPES.MAYBE.STYLE),
            new ButtonBuilder()
                .setCustomId(BUTTON.TYPES.NO.ID)
                .setLabel(BUTTON.TYPES.NO.LABEL)
                .setStyle(BUTTON.TYPES.NO.STYLE)
        );          
        
        // Filter to only capture button clicks from the user who initiated the command
        const filter = buttonInteraction => 
            // Verify it's the original user who is clicking
            buttonInteraction.user.id === interaction.user.id &&
            // Verify the clicked button is one of our three options
            [BUTTON.TYPES.YES.ID, BUTTON.TYPES.MAYBE.ID, BUTTON.TYPES.NO.ID].includes(buttonInteraction.customId);
              
        // Send the message with buttons and get a reference to attach the collector
        const message = await interaction.reply({
            components: [row], // Add buttons to the interface
            content: `${UI_TEXT.QUESTION_PREFIX}\`${selectedQuestion.question}\``,
            fetchReply: true // Important to get the message reference for the collector
        });
        
        try {                
            // Create a collector that waits only for a button click
            // Note: This only collects interactions with components (buttons),
            // not normal text messages
            const collector = message.createMessageComponentCollector({ 
                filter,
                time: RESPONSE_TIMEOUT_MS,
                max: 1 // Only one response expected
            });                
            
            // When a button is clicked, this function is called
            collector.on('collect', async buttonInteraction => {
                try {
                    // Process the player's response (button click)
                    await handleButtonResponse(buttonInteraction, currentQuestionData);
                } catch (error) {
                    console.error('Error in button interaction handler:', error);
                }
            });

            // If the time expires without a button click
            collector.on('end', async collected => {
                if (collected.size === 0) {
                    try {
                        await interaction.followUp({ 
                            content: UI_TEXT.TIMEOUT_MESSAGE,
                            ephemeral: true 
                        });
                    } catch (error) {
                        console.error('Error sending timeout message:', error);
                    }
                }
                
                // Make sure to disable buttons on timeout to prevent interaction errors
                try {
                    if (message.editable) {
                        const disabledRow = new ActionRowBuilder().addComponents(
                            row.components.map(button => {
                                const newButton = ButtonBuilder.from(button);
                                newButton.setDisabled(true);
                                return newButton;
                            })
                        );
                        
                        await message.edit({ components: [disabledRow] });
                    }
                } catch (error) {
                    console.error('Error disabling buttons after timeout:', error);
                }
            });
        } catch (error) {
            console.error('Error while handling collector:', error);
        }
    }
};

/**
 * Handles the user's response to a quiz question
 * @param {ButtonInteraction} buttonInteraction - The button interaction
 * @param {Object} questionData - The current question data
 */
async function handleButtonResponse(buttonInteraction, questionData) {
    // Acknowledge the interaction IMMEDIATELY before doing anything else
    try {
        await buttonInteraction.deferUpdate();
    } catch (error) {
        if (error.code === 10062) {
            console.warn('Button interaction expired or already responded to (deferUpdate).');
            return;
        } else {
            console.error('Error deferring button interaction:', error);
            return;
        }
    }
    
    const userChoice = buttonInteraction.customId;
    const components = []; // We remove buttons after the response
    let responseContent = '';
    let emoji = null;    
    
    // Special case: trick question where a conservative is forced to answer "no"
    if (questionData.isTrick && userChoice === BUTTON.TYPES.NO.ID) {
        responseContent = RESPONSES.TRAP_TRIGGERED.message;
        emoji = RESPONSES.TRAP_TRIGGERED.emoji;    
    } else {
        // Standard responses based on user choice
        responseContent = RESPONSES.DEFAULT[userChoice];
    }    
    
    // Find the button type corresponding to the user's choice
    const selectedButtonType = Object.values(BUTTON.TYPES).find(type => type.ID === userChoice);
    
    // Set the embed color directly from the button type
    const embedColor = selectedButtonType ? selectedButtonType.COLOR : BUTTON.TYPES.NO.COLOR;

    // Create an embed for a more elaborate response
    const responseEmbed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle(UI_TEXT.QUIZ_ANSWER_TITLE)
        .setDescription(`${UI_TEXT.QUIZ_ANSWER_PREFIX}\`${questionData.question}\``)
        .addFields(
            { name: UI_TEXT.RESPONSE_TITLE, value: buttonInteraction.component.label, inline: true }
        )
        .setFooter({ text: UI_TEXT.QUIZ_FOOTER })
        .setTimestamp();    

    // Edit the message after acknowledging the interaction
    try {
        await buttonInteraction.message.edit({
            content: responseContent,
            embeds: [responseEmbed],
            components: components
        });
    } catch (error) {
        console.error('Error editing message after button interaction:', error);
    }

    // Add a reaction if it's a trick question
    if (emoji && buttonInteraction.message) {
        try {
            await buttonInteraction.message.react(emoji);
        } catch (error) {
            console.error('Error during adding reaction:', error);
        }
    }
}