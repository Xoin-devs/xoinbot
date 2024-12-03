const dotenv = require("dotenv").config({ path: ".env" });
const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, "../commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        console.log(`Deploying command at ${commandsPath}/${file}`);
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ("data" in command && "execute" in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Construct and prepare an instance of the REST module
let rest = new REST().setToken(process.env.TEST_DISCORD_TOKEN);
let appId = process.env.TEST_APP_ID;
let serverId = process.env.TEST_SERVER_ID;
console.log("process.env", process.env.IN_TEST_ENVIRONMENT);
if (process.env.IN_TEST_ENVIRONMENT) {
    console.log("in test");
} else {
    console.log("Deploying to production environment.");
    rest = new REST().setToken(process.env.DISCORD_TOKEN);
    appId = process.env.APP_ID;
    serverId = process.env.SERVER_ID;
}

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(Routes.applicationGuildCommands(appId, serverId), { body: commands });
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();
