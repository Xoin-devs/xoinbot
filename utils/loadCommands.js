require('module-alias/register');
const fs = require("fs");
const path = require("path");
const logger = require("@utils/logger");

module.exports = function loadCommandsAtStart(client) {
    const foldersPath = path.join(__dirname, "../commands");
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs
            .readdirSync(commandsPath)
            .filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
            logger(`Loading command at ${commandsPath}/${file}`);
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ("data" in command && "execute" in command) {
                client.commands.set(command.data.name, command);
            } else {
                logger(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
};
