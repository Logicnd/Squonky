const { ChannelType, PermissionFlagsBits } = require("discord.js");

function extractId(input) {
    if (!input) return null;
    const match = String(input).match(/\d{17,20}/);
    return match ? match[0] : null;
}

async function resolveTargetMember(message, targetArg) {
    if (!message.guild) return null;

    const mentionedMember = message.mentions.members?.first();
    if (mentionedMember) return mentionedMember;

    const targetId = extractId(targetArg);
    if (!targetId) return null;

    try {
        return await message.guild.members.fetch(targetId);
    } catch (error) {
        return null;
    }
}

function getSendableTextChannels(message, config) {
    if (!message.guild) return [];

    const allChannels = message.guild.channels.cache.filter(channel => (
        channel.type === ChannelType.GuildText ||
        channel.type === ChannelType.GuildAnnouncement
    ));

    const allowed = config.allowedChannelIds?.length
        ? allChannels.filter(channel => config.allowedChannelIds.includes(channel.id))
        : allChannels;

    return Array.from(allowed.values()).filter(channel => (
        channel.viewable &&
        channel.permissionsFor(message.client.user)?.has(PermissionFlagsBits.SendMessages)
    ));
}

function shuffle(items) {
    for (let i = items.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
}

function selectBroadcastChannels(message, config, maxChannels) {
    if (!message.guild) return [];

    if (config.safeMode) {
        return message.channel?.isTextBased() ? [message.channel] : [];
    }

    const candidates = getSendableTextChannels(message, config)
        .filter(channel => channel.id !== message.channel.id);

    if (!candidates.length) {
        return message.channel?.isTextBased() ? [message.channel] : [];
    }

    const shuffled = shuffle(candidates);
    return shuffled.slice(0, Math.max(1, maxChannels));
}

module.exports = {
    extractId,
    resolveTargetMember,
    getSendableTextChannels,
    selectBroadcastChannels
};
