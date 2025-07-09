const { Client, GatewayIntentBits, Events, Collection } = require("discord.js");
const { toZonedTime } = require("date-fns-tz");
const dotenv = require("dotenv");
const loadCommandsAtStart = require("./utils/load-commands-at-start");
const isStateChangeLegitimate = require("./utils/is-state-change-legitimate");

// Load environment variables
dotenv.config();

// Constants
const ENVIRONMENT = {
  TEST: {
    TOKEN: process.env.TEST_DISCORD_TOKEN,
    VOICE_CHANNEL_ID: process.env.TEST_VOICECHAT_CHANNEL,
    TEXT_CHANNEL_ID: process.env.TEST_ANNOUNCEMENT_CHANNEL,
  },
  PRODUCTION: {
    TOKEN: process.env.DISCORD_TOKEN,
    VOICE_CHANNEL_ID: process.env.SNEK_VOICECHAT_CHANNEL,
    TEXT_CHANNEL_ID: process.env.SNEK_ANNOUNCEMENT_CHANNEL,
  },
};

const PARIS_TIMEZONE = 'Europe/Paris';

const XOIN_MESSAGES = {
  WEEKEND: " est au Xoin !",
  WORK_HOURS: " a posé sa journée !",
  EARLY_MORNING: " ne va pas se lever demain parce qu'il est un gros chômeur !",
  EVENING: " est au Xoin !",
};

const BUTTON_RESPONSES = {
  YES: "C'est une micro-agression, je suis bicurieux",
  NO: "Non c'est pas raciste, c'est de l'humour",
};

const ERROR_MESSAGE = "There was an error while executing this command!";

/**
 * Initialize Discord client with required intents
 */
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

/**
 * Determine environment configuration based on environment variable
 */
const config = process.env.IN_TEST_ENVIRONMENT 
  ? ENVIRONMENT.TEST 
  : ENVIRONMENT.PRODUCTION;

if (!process.env.IN_TEST_ENVIRONMENT) {
  console.log("Starting in production mode");
}

/**
 * Get member count for a voice channel
 * @param {VoiceChannel} channel - The voice channel to check
 * @returns {Promise<number>} The number of members in the channel
 */
async function getMembersCount(channel) {
  if (channel === null) return 0;
  const fetchedChannel = await channel.fetch(true);
  return fetchedChannel.members.size;
}

/**
 * Generate a context-aware message based on time of day and day of week
 * @returns {string} The appropriate message string
 */
function getXoinMessage() {
  const dateTime = toZonedTime(new Date(), PARIS_TIMEZONE);
  const hours = dateTime.getHours();
  const dayOfWeek = dateTime.getDay();
  
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return XOIN_MESSAGES.WEEKEND;
  } else if (hours > 8 && hours < 19) {
    return XOIN_MESSAGES.WORK_HOURS;
  } else if (hours <= 8) {
    return XOIN_MESSAGES.EARLY_MORNING;
  } else {
    return XOIN_MESSAGES.EVENING;
  }
}

/**
 * Log a message with timestamp
 * @param {string} message - Message to log
 */
function logWithTimestamp(message) {
  const timestamp = new Date();
  console.log(`${timestamp} - ${message}`);
}

/**
 * Handle voice state changes to announce when users join the watched channel
 */
function setupVoiceStateHandler() {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    const { member, channel } = newState;
    
    const newMembersCount = await getMembersCount(newState.channel);

    if (!isStateChangeLegitimate(oldState, newState)) {
      logWithTimestamp("State change is not legitimate.");
      return;
    }
    
    if (newMembersCount > 1) {
      logWithTimestamp(`No need to announce : ${newMembersCount} members in the channel.`);
      return;
    }

    if (channel && channel.id === config.VOICE_CHANNEL_ID) {
      const userName = member.user.username;
      const textChannel = client.channels.cache.get(config.TEXT_CHANNEL_ID);

      logWithTimestamp(`${userName} is at the Xoin!`);
      textChannel.send(`${userName}${getXoinMessage()}`);
    }
  });
}

/**
 * Handle interaction events (buttons and commands)
 */
function setupInteractionHandler() {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isButton()) {
      await handleButtonInteraction(interaction);
      return;
    } 
    
    if (!interaction.isChatInputCommand()) return;
    await handleCommandInteraction(interaction);
  });
}

/**
 * Handle button click interactions
 * @param {Interaction} interaction - The button interaction
 */
async function handleButtonInteraction(interaction) {
  if (interaction.customId === "yes") {
    await interaction.update({
      content: BUTTON_RESPONSES.YES,
      components: [],
    });
  } else if (interaction.customId === "no") {
    await interaction.update({
      content: BUTTON_RESPONSES.NO,
      components: [],
    });
  }
}

/**
 * Handle command interactions
 * @param {Interaction} interaction - The command interaction
 */
async function handleCommandInteraction(interaction) {
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    
    const replyOptions = {
      content: ERROR_MESSAGE,
      ephemeral: true,
    };
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(replyOptions);
    } else {
      await interaction.reply(replyOptions);
    }
  }
}

/**
 * Initialize the bot
 */
function initializeBot() {
  // Set up commands collection
  client.commands = new Collection();
  loadCommandsAtStart(client);
  
  // Register event handlers
  setupVoiceStateHandler();
  setupInteractionHandler();
  
  // Log when bot is ready
  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  });
  
  // Login with token
  client.login(config.TOKEN);
}

// Start the bot
initializeBot();
