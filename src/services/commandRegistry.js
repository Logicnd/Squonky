const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");
const { normalizeCommand, validateCommand } = require("../utils/commandValidation");
const { normalizePermissions } = require("../utils/permissions");

function loadCommandsFrom(directory, options = {}) {
    if (!fs.existsSync(directory)) return [];

    const entries = fs.readdirSync(directory, { withFileTypes: true });
    const files = entries.filter(entry => (
        entry.isFile() &&
        entry.name.endsWith(".js") &&
        entry.name !== "index.js"
    ));

    return files.map(file => {
        const command = require(path.join(directory, file.name));
        if (options.ownerDefault && command.ownerOnly !== false) {
            command.ownerOnly = true;
        }
        return command;
    });
}

async function deployCommands(commands, credentials, logger) {
    const { token, clientId } = credentials;
    if (!token || !clientId) {
        logger?.warn("Cannot deploy commands: Missing token or clientId.");
        return;
    }

    const rest = new REST({ version: "10" }).setToken(token);
    const body = [];
    const processedNames = new Set();

    for (const cmd of commands.values()) {
        // Skip aliases to avoid duplicate registration
        if (processedNames.has(cmd.name)) continue;
        processedNames.add(cmd.name);

        if (cmd.data) {
            body.push(cmd.data.toJSON());
        }
    }

    try {
        if (logger) {
             logger.info(`Refreshing ${body.length} application (/) commands...`);
        }
        await rest.put(
            Routes.applicationCommands(clientId),
            { body },
        );
        if (logger) {
            logger.info("Successfully reloaded application (/) commands.");
        }
    } catch (error) {
        logger?.error("Failed to deploy commands", error);
    }
}

function createCommands({ logger }) {
    const baseDir = path.join(__dirname, "..", "commands");
    
    // Define command categories and their loading options
    const commandList = [
        // Load Guest commands (default permissions)
        ...loadCommandsFrom(path.join(baseDir, "Guest")),
        
        // Load Admin commands (permissions will be enforced by command validation)
        ...loadCommandsFrom(path.join(baseDir, "Admins")),
        
        // Load Owner commands (force ownerOnly flag)
        ...loadCommandsFrom(path.join(baseDir, "Owners"), { ownerDefault: true }),

        // Load DANGEROUS commands (force ownerOnly + custom handling logic implicitly)
        ...loadCommandsFrom(path.join(baseDir, "Dangerous"), { ownerDefault: true })
    ];

    const commands = new Map();
    const errors = [];

    for (const rawCommand of commandList) {
        const normalized = normalizeCommand(rawCommand);
        normalized.permissions = normalizePermissions(normalized.permissions);

        const validationErrors = validateCommand(normalized);
        if (validationErrors.length) {
            errors.push({ name: normalized.name || "unknown", errors: validationErrors });
            continue;
        }

        commands.set(normalized.name, normalized);
        if (normalized.aliases.length) {
            for (const alias of normalized.aliases) {
                commands.set(alias, normalized);
            }
        }
    }

    if (errors.length) {
        logger?.warn("Some commands failed validation", errors);
    }

    return commands;
}

module.exports = {
    createCommands,
    deployCommands
};
