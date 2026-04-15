// ── sleep ──────────────────────────────────────────────────────────────────
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ── format ─────────────────────────────────────────────────────────────────
function formatDuration(totalSeconds) {
    const seconds = Math.max(0, Math.floor(totalSeconds));
    const days    = Math.floor(seconds / 86400);
    const hours   = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remaining = seconds % 60;
    const parts = [];
    if (days)              parts.push(`${days}d`);
    if (hours || parts.length) parts.push(`${hours}h`);
    if (minutes || parts.length) parts.push(`${minutes}m`);
    parts.push(`${remaining}s`);
    return parts.join(" ");
}

function formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const index = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
    return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
}

// ── safeReply ──────────────────────────────────────────────────────────────
async function safeReply(target, payload) {
    try {
        if (target.isCommand?.() || target.isRepliable?.()) {
            if (target.replied || target.deferred) return await target.followUp(payload);
            return await target.reply(payload);
        }
        return await target.reply(payload);
    } catch {
        try { if (target.channel) return await target.channel.send(payload); } catch { /* silent */ }
        return null;
    }
}

// ── parseCommand ───────────────────────────────────────────────────────────
function parseCommand(message, prefix, botId) {
    if (!message.content) return null;
    const mentionPrefix = botId ? new RegExp(`^<@!?${botId}>\\s+`) : null;
    let content = message.content.trim();
    let usedPrefix = null;

    if (content.startsWith(prefix)) {
        usedPrefix = prefix;
        content = content.slice(prefix.length);
    } else if (mentionPrefix?.test(content)) {
        usedPrefix = "mention";
        content = content.replace(mentionPrefix, "");
    }

    if (!usedPrefix) return null;
    const parts = content.trim().split(/\s+/);
    const commandName = parts.shift()?.toLowerCase();
    if (!commandName) return null;
    return { commandName, args: parts, usedPrefix };
}

// ── animateLog ─────────────────────────────────────────────────────────────
// Sends an embed and edits it progressively with log lines at `delayMs` intervals.
// steps: Array<string>  — each string is appended as a new log line
// Returns the final embed after all steps.
async function animateLog(ctx, embed, steps, delayMs = 800) {
    const lines = [];
    let prompt = null;

    for (const step of steps) {
        lines.push(step);
        const updated = embed.setDescription("```\n" + lines.join("\n") + "\n```");
        if (!prompt) {
            try { prompt = await ctx.reply({ embeds: [updated], fetchReply: true }); }
            catch { prompt = await ctx.reply({ embeds: [updated] }).catch(() => null); }
        } else {
            try { await prompt.edit({ embeds: [updated] }); } catch { /* best effort */ }
        }
        await sleep(delayMs);
    }
    return prompt;
}

module.exports = {
    sleep,
    formatDuration,
    formatBytes,
    safeReply,
    parseCommand,
    animateLog
};
