import "dotenv/config.js";
import { capitalize, InstallGlobalCommands } from './utils.js';

// Simple test command
const HELLO_COMMAND = {
  name: 'hello',
  description: 'Basic command',
  type: 1,
};

const MARMOTTE_COMMAND = {
  name: 'marmotte',
  description: 'Marmotte\'s time',
  type: 1,
};

const WHO_COMMAND = {
  name: 'who',
  description: 'Who am I?',
  type: 1,
};

// Command containing options
const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Challenge to a match of rock paper scissors',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
    },
  ],
  type: 1,
};

const ALL_COMMANDS = [MARMOTTE_COMMAND, HELLO_COMMAND, CHALLENGE_COMMAND, WHO_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);