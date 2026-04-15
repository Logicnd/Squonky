const { PermissionFlagsBits } = require("discord.js");

function isOwner(userId, ownerIds) {
    return Array.isArray(ownerIds) && ownerIds.includes(userId);
}

function isAllowedGuild(context, config) {
    if (!config.allowedGuildIds?.length) return true;
    return context.guild && config.allowedGuildIds.includes(context.guild.id);
}

function isAllowedChannel(context, config) {
    if (!config.allowedChannelIds?.length) return true;
    return context.channel && config.allowedChannelIds.includes(context.channel.id);
}

function getPermissionError(command, context, config) {
    const effectiveConfig = config || {};
    const user = context.author || context.user;
    let guild = context.guild;
    let member = context.member || null;
    
    // Dynamic context hunting: If no guild but command is guildOnly, try to find a shared sector.
    if (!guild && command.guildOnly) {
        const client = context.client || context.source?.client;
        if (client) {
            const sharedGuilds = client.guilds?.cache?.filter(g => g.members.cache.has(user.id));
            if (sharedGuilds?.size > 0) {
                guild = sharedGuilds.first();
                context.guild = guild;
                member = guild.members.cache.get(user.id) || null;
                context.member = member;
            }
        }
    }

    if (command.dmOnly && guild) {
        return "This command is optimized for direct channels only.";
    }

    // Server-agnostic override: If the bot has the required permissions in the CURRENT channel,
    // we bypass the global guild restriction logic for that execution.
    const currentChannel = context.channel;
    const botMember = guild?.members?.me;
    
    let hasLocalOverride = false;
    if (currentChannel && botMember && command.permissions?.length) {
        const missingLocal = command.permissions.filter(perm => !currentChannel.permissionsFor(botMember)?.has(perm));
        if (missingLocal.length === 0) {
            hasLocalOverride = true;
        }
    }

    // Only apply guild/channel restrictions if no local override is present
    if (!hasLocalOverride) {
        if (!isAllowedGuild(context, effectiveConfig)) {
            return "Sector restricted. Access denied.";
        }

        if (!isAllowedChannel(context, effectiveConfig)) {
            return "Channel protocols restricted. Command blocked.";
        }
    }

    if (command.ownerOnly && !isOwner(user.id, effectiveConfig.ownerIds)) {
        return "Unauthorized access. System owner clearance required.";
    }

    if (command.permissions?.length && guild) {
        // Sector owner is granted implicit authority.
        if (user.id === guild.ownerId) {
            // Authority recognized. Bypass permission check.
        } else {
            member = member || guild.members.cache.get(user.id) || null;
            const missing = command.permissions.filter(perm => !member?.permissions?.has?.(perm));
            if (missing.length > 0) {
                // Final check: if they have perms in the specific channel, allow it
                const missingLocal = command.permissions.filter(perm => !currentChannel?.permissionsFor(member)?.has(perm));
                if (missingLocal.length > 0) {
                    return `Missing sector permissions: ${missing.join(", ")}`;
                }
            }
        }
    }

    return null;
}

function normalizePermissions(perms) {
    if (!perms) return [];
    return perms.map(perm => (
        typeof perm === "string" && PermissionFlagsBits[perm]
            ? PermissionFlagsBits[perm]
            : perm
    ));
}

module.exports = {
    isOwner,
    isAllowedGuild,
    isAllowedChannel,
    getPermissionError,
    normalizePermissions
};
