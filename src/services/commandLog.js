const { emitAudit } = require("./auditLogger");

async function logCommandExecution(context, command, meta) {
    try {
        const { config, logger } = context || {};
        // Prioritize meta.message (passed by interaction handler), then context.message
        const msg = meta?.message || context?.message;
        
        const authorTag = msg?.author?.tag || msg?.user?.tag || "unknown";
        const authorId = msg?.author?.id || msg?.user?.id || "unknown";
        
        // Robust Guild Detection
        const guildId = msg?.guild?.id || msg?.guildId || meta?.guildId;
        const guildName = msg?.guild?.name || "Unknown Server";
        const guildLabel = guildId ? `${guildName} (${guildId})` : "DM";

        const data = {
            command: command?.name || "unknown",
            user: `${authorTag} (${authorId})`,
            guild: guildLabel,
            channel: msg?.channel?.id || "unknown",
            ...meta
        };

        // Remove circular objects from meta before logging if necessary
        delete data.message; 

        if (logger && logger.command) {
            logger.command(`EXECUTED: ${data.command} by ${authorTag} in ${guildLabel}`);
        }

        await emitAudit("command.executed", config, data);
    } catch (error) {
        console.error("Failed to log command execution:", error);
        // Suppress logging errors to prevent command failure
    }
}

async function logCommandError(context, command, error) {
    try {
        const { config } = context || {};
        const msg = context?.message || (context?.interaction ? { 
            author: context.interaction.user, 
            guild: context.interaction.guild,
            channel: context.interaction.channel 
        } : null);

        const authorTag = msg?.author?.tag || msg?.user?.tag || "unknown";
        const authorId = msg?.author?.id || msg?.user?.id || "unknown";
        const guildLabel = msg?.guild 
            ? `${msg.guild.name} (${msg.guild.id})` 
            : (msg?.guildId ? `Uncached Guild (${msg.guildId})` : "DM");

        const data = {
            command: command?.name || "unknown",
            user: `${authorTag} (${authorId})`,
            guild: guildLabel,
            channel: msg?.channel?.id || "unknown",
            error: error?.message || String(error)
        };

        await emitAudit("command.error", config, data);
    } catch (logError) {
        console.error("Failed to log command error:", logError);
    }
}

module.exports = {
    logCommandExecution,
    logCommandError
};
