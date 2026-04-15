const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require("discord.js");
const { emitAudit } = require("../services/auditLogger");

const authAttempts = new Map(); // userId -> { count, lockoutUntil }
const LOCKOUT_THRESHOLD = 3;
const LOCKOUT_TIME_MS = 10 * 60 * 1000;
const AUTH_WINDOW_MS = 30 * 1000;

async function safeAudit(event, config, payload) {
    try {
        await emitAudit(event, config, payload);
    } catch {
        // Audit transport should never break command execution.
    }
}

async function safeEdit(prompt, context, payload) {
    const targets = [
        () => prompt?.edit(payload),
        () => context?.interaction?.editReply(payload),
        () => context?.editReply?.(payload),
        () => context?.reply?.(payload)
    ];
    for (const fn of targets) {
        try { return await fn(); } catch { /* try next */ }
    }
    return null;
}

function buildConfirmEmbed(commandName, user) {
    return new EmbedBuilder()
        .setColor(0xFF2222)
        .setTitle(`DANGEROUS COMMAND: \`${commandName.toUpperCase()}\``)
        .setDescription("This operation is **high-impact and irreversible**.\nReview the details below before confirming.")
        .addFields(
            { name: "Requested by", value: `<@${user.id}>`, inline: true },
            { name: "Command", value: `\`${commandName}\``, inline: true },
            { name: "Warning", value: "This action **cannot be undone**. Confirm only if you are certain.", inline: false }
        )
        .setFooter({ text: "R3D Security System  •  Authorization required" })
        .setTimestamp();
}

function buildResultEmbed(type, commandName) {
    const states = {
        executing: {
            color: 0x000000,
            title: "Executing...",
            desc: `\`${commandName.toUpperCase()}\` is now running.`
        },
        aborted: {
            color: 0x00CC66,
            title: "Cancelled",
            desc: "Operation was cancelled. No changes were made."
        },
        timeout: {
            color: 0x555555,
            title: "Timed Out",
            desc: "No response received within 30 seconds. Operation cancelled."
        },
        denied: {
            color: 0xFF6600,
            title: "Access Denied",
            desc: "You are not authorized to run this command."
        },
        lockout: {
            color: 0xFF0000,
            title: "Security Lockout",
            desc: null // set dynamically
        },
        error: {
            color: 0xFF0000,
            title: "Execution Error",
            desc: null
        }
    };

    const s = states[type] || states.error;
    return new EmbedBuilder()
        .setColor(s.color)
        .setTitle(s.title)
        .setDescription(s.desc)
        .setFooter({ text: "R3D Security System" })
        .setTimestamp();
}

function buildConfirmRow() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("auth_confirm")
            .setLabel("Execute")
            .setEmoji("⚡")
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId("auth_cancel")
            .setLabel("Cancel")
            .setEmoji("✖")
            .setStyle(ButtonStyle.Secondary)
    );
}

async function requireDangerousAuth(context, commandName, callback, providedConfig) {
    const user = context?.user || context?.author;
    const channel = context?.channel;
    const config = providedConfig || context?.config;
    const ownerIds = Array.isArray(config?.ownerIds) ? config.ownerIds : [];
    const now = Date.now();

    if (!user || !channel || typeof context?.reply !== "function") return null;

    if (!config) {
        return context.reply({ content: "System error: missing configuration.", ephemeral: true });
    }

    // Permission check
    if (!ownerIds.includes(user.id)) {
        await safeAudit("UNAUTHORIZED_DANGEROUS_ATTEMPT", config, {
            user: user.tag, userId: user.id, command: commandName
        });
        return context.reply({
            embeds: [buildResultEmbed("denied", commandName)],
            ephemeral: true
        });
    }

    // Lockout check
    const lockout = authAttempts.get(user.id);
    if (lockout?.lockoutUntil > now) {
        const minutes = Math.ceil((lockout.lockoutUntil - now) / 60000);
        const embed = buildResultEmbed("lockout", commandName)
            .setDescription(`You are locked out. Try again in **${minutes} minute(s)**.`);
        return context.reply({ embeds: [embed], ephemeral: true });
    }

    await safeAudit("DANGEROUS_AUTH_INITIATED", config, {
        user: user.tag, userId: user.id, command: commandName
    });

    // Send confirmation prompt
    let prompt = null;
    try {
        prompt = await context.reply({
            embeds: [buildConfirmEmbed(commandName, user)],
            components: [buildConfirmRow()],
            fetchReply: true
        });
    } catch {
        prompt = await context.reply({
            embeds: [buildConfirmEmbed(commandName, user)],
            components: [buildConfirmRow()]
        }).catch(() => null);
    }

    // Collect button interaction
    const collector = channel.createMessageComponentCollector({
        filter: (i) => i.user.id === user.id && i.message.id === (prompt?.id ?? context.interaction?.id),
        componentType: ComponentType.Button,
        time: AUTH_WINDOW_MS,
        max: 1
    });

    const decision = await new Promise((resolve) => {
        collector.on("collect", async (i) => {
            await i.deferUpdate();
            resolve(i.customId === "auth_confirm" ? "confirmed" : "cancelled");
        });
        collector.on("end", (collected) => {
            if (collected.size === 0) resolve("timeout");
        });
    });

    // Handle non-confirmed outcomes
    if (decision !== "confirmed") {
        const type = decision === "timeout" ? "timeout" : "aborted";
        const auditType = decision === "timeout" ? "DANGEROUS_AUTH_TIMEOUT" : "DANGEROUS_COMMAND_ABORTED";
        await safeAudit(auditType, config, { user: user.tag, userId: user.id, command: commandName });
        await safeEdit(prompt, context, {
            embeds: [buildResultEmbed(decision === "timeout" ? "timeout" : "aborted", commandName)],
            components: []
        });
        return null;
    }

    authAttempts.delete(user.id);
    await safeAudit("DANGEROUS_AUTH_SUCCESS", config, { user: user.tag, userId: user.id, command: commandName });

    // Show executing state
    await safeEdit(prompt, context, {
        embeds: [buildResultEmbed("executing", commandName)],
        components: []
    });

    await safeAudit("DANGEROUS_COMMAND_EXECUTED", config, { user: user.tag, userId: user.id, command: commandName });

    try {
        await callback();
    } catch (error) {
        console.error(`[EXECUTION ERROR] ${commandName}:`, error);
        const errEmbed = buildResultEmbed("error", commandName)
            .setDescription(`**Execution failed:** ${error.message}`);
        channel.send({ embeds: [errEmbed] }).catch(() => {});
    }

    return null;
}

module.exports = { requireDangerousAuth };
