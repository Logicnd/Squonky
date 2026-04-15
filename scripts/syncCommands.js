const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../src/config');
const logger = require('../src/utils/logger');

const commands = [];
const commandDir = path.join(__dirname, '..', 'src', 'commands');

if (!fs.existsSync(commandDir)) {
    console.error(`CRITICAL: Command directory not found at: ${commandDir}`);
    process.exit(1);
}

const processCommandFile = (filePath, file) => {
    try {
        const command = require(filePath);
        if (command.data && typeof command.data.toJSON === 'function') {
            const cmdData = command.data.toJSON();
            // Ensure commands can be used in DMs and all guilds globally
            cmdData.integration_types = [0, 1]; // 0: GUILD_INSTALL, 1: USER_INSTALL
            cmdData.contexts = [0, 1, 2]; // 0: GUILD, 1: BOT_DM, 2: PRIVATE_CHANNEL
            commands.push(cmdData);
        } else if (command.name && command.description) {
            // Fallback for commands that might not have a SlashCommandBuilder yet
            commands.push({
                name: command.name,
                description: command.description,
                options: [],
                integration_types: [0, 1],
                contexts: [0, 1, 2]
            });
        }
    } catch (error) {
        logger.error(`Error loading command for sync: ${file}`, error);
    }
};

const entries = fs.readdirSync(commandDir);

for (const entry of entries) {
    const fullPath = path.join(commandDir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
        const commandFiles = fs.readdirSync(fullPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            processCommandFile(path.join(fullPath, file), file);
        }
    } else if (entry.endsWith('.js') && entry !== 'index.js') {
        processCommandFile(fullPath, entry);
    }
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        logger.info(`Initiating synchronization for ${commands.length} command modules...`);

        // Extract Client ID from token if not provided
        let clientId = process.env.CLIENT_ID;
        if (!clientId && config.token) {
            try {
                clientId = Buffer.from(config.token.split('.')[0], 'base64').toString();
                logger.info(`Detected Client ID from token: ${clientId}`);
            } catch (e) {
                logger.error('Failed to extract Client ID from token.');
            }
        }

        if (!clientId) {
            throw new Error('CLIENT_ID not found in environment and extraction failed.');
        }

        // Always register globally
        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        logger.info(`SUCCESS: Successfully reloaded ${data.length} application (/) commands globally.`);
        logger.info('NOTE: If commands do not appear immediately, restart your Discord client. Global commands can take up to an hour to cache across all guilds.');
    } catch (error) {
        logger.error('CRITICAL: Failed to synchronize application commands.', error);
    }
})();
