const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, "../features/commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        console.log(`Loading command at ${commandsPath}/${file}`);
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ("data" in command && "execute" in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            );
        }
    }
}

// Construct and prepare an instance of the REST module
let rest = new REST().setToken(process.env.TEST_DISCORD_TOKEN);
if (process.env.IN_TEST_ENVIRONMENT !== "1") {
    console.log("Deploying to production environment.");
    rest = new REST().setToken(process.env.DISCORD_TOKEN);
}

// and deploy your commands!
(async () => {
    try {
        console.log(
            `Started refreshing ${commands.length} application (/) commands.`
        );
        let appId = process.env.TEST_APP_ID;
        let serverId = process.env.TEST_SERVER_ID;
        if (process.env.IN_TEST_ENVIRONMENT !== "1") {
            appId = process.env.APP_ID;
            serverId = process.env.SERVER_ID;
        }

        const data = await rest.put(
            Routes.applicationGuildCommands(appId, serverId),
            { body: commands }
        );

        console.log(
            `Successfully reloaded ${data.length} application (/) commands.`
        );
    } catch (error) {
        console.error(error);
    }
})();
