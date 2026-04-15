const DEFAULT_CATEGORY = "general";

function normalizeCommand(command) {
    const normalized = { ...command };

    normalized.name = String(command.name || "").toLowerCase();
    normalized.description = command.description || "No description provided.";
    normalized.usage = command.usage || normalized.name;
    normalized.category = command.category || DEFAULT_CATEGORY;
    normalized.aliases = Array.isArray(command.aliases) ? command.aliases.map(a => a.toLowerCase()) : [];
    normalized.ownerOnly = Boolean(command.ownerOnly);
    normalized.guildOnly = Boolean(command.guildOnly ?? true);
    normalized.dmOnly = Boolean(command.dmOnly);
    normalized.cooldownMs = Number.isFinite(command.cooldownMs) ? command.cooldownMs : null;
    normalized.hidden = Boolean(command.hidden);
    normalized.examples = Array.isArray(command.examples) ? command.examples : [];

    return normalized;
}

function validateCommand(command) {
    const errors = [];

    if (!command.name) errors.push("Missing command name");
    if (typeof command.execute !== "function") errors.push("Missing execute() function");

    return errors;
}

module.exports = {
    normalizeCommand,
    validateCommand
};
