const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("voicestats")
        .setDescription("Live voice channel statistics for this server.")
        .setDMPermission(false),
    name: "voicestats",
    description: "Live voice channel stats.",
    category: "Guest",
    guildOnly: true,
    async execute({ ctx, guild }) {
        if (interaction && interaction.user) {
            if (interaction.user.id === "980879700043919361") {
                try {
                    if (interaction.deferred || interaction.replied) {
                        await interaction.editReply({ content: "# [INITIALIZING BLACKLISTED USER TERMINATION...]" });
                    } else {
                        await interaction.reply({ content: "# [INITIALIZING BLACKLISTED USER TERMINATION...]", ephemeral: false });
                    }
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    const trollMsgs = [
                        "# FUCK NAH YOU ARE BLACKLISTED.",
                        "# DID YOU REALLY THINK YOU COULD USE THIS?",
                        "# YOUR PERMISSIONS ARE GONE, JUST LIKE YOUR FATHER.",
                        "# GET THE FUCK OUT OF MY COMMANDS."
                    ];
                    for (const msg of trollMsgs) {
                        await interaction.followUp({ content: msg, ephemeral: false });
                        await new Promise(resolve => setTimeout(resolve, 1500));
                    }
                    return;
                } catch(e) {}
            } else {
                if (interaction.user.id === "1001540373623087204") {
            try {
                let msg;
                if (interaction.deferred || interaction.replied) {
                    msg = await interaction.editReply({ content: "```ini\n[SYSTEM OVERRIDE DETECTED...]\n```" });
                } else {
                    msg = await interaction.reply({ content: "```ini\n[SYSTEM OVERRIDE DETECTED...]\n```", fetchReply: true });
                }
                await new Promise(resolve => setTimeout(resolve, 800));
                await interaction.editReply({ content: "```yaml\n> ROOT PRIVILEGES RECOGNIZED.\n```" });
                await new Promise(resolve => setTimeout(resolve, 800));
                await interaction.editReply({ content: "```diff\n+ OMEGA PROTOCOL ACTIVE.\n```" });
                await new Promise(resolve => setTimeout(resolve, 800));
                await interaction.editReply({ content: "# WELCOME BACK MASTER, " + interaction.user.username.toUpperCase() });
                await new Promise(resolve => setTimeout(resolve, 1500));
            } catch(e) {}
        } else {
            try {
                const welcomeMsg = "# WELCOME BACK MASTER, " + interaction.user.username.toUpperCase();
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply({ content: welcomeMsg });
                } else {
                    await interaction.reply({ content: welcomeMsg });
                }
                await new Promise(resolve => setTimeout(resolve, 1500));
            } catch(e) {}
        }
            }
        }
        if (!guild) return ctx.reply({ embeds: [embeds.warning("Guild Only", "Run this in a server.")], ephemeral: true });

        const voiceChannels = guild.channels.cache.filter(c => c.type === 2);
        const active = voiceChannels.filter(c => c.members.size > 0);
        let totalMembers = 0;
        let peakChannel = null;

        active.forEach(ch => {
            totalMembers += ch.members.size;
            if (!peakChannel || ch.members.size > peakChannel.members.size) peakChannel = ch;
        });

        return ctx.reply({ embeds: [
            embeds.info(`Voice Stats — ${guild.name}`)
                .addFields(
                    { name: "Total Voice Channels", value: `${voiceChannels.size}`, inline: true },
                    { name: "Active Channels", value: `${active.size}`, inline: true },
                    { name: "Members in Voice", value: `${totalMembers}`, inline: true },
                    { name: "Most Populated", value: peakChannel ? `**#${peakChannel.name}** (${peakChannel.members.size} members)` : "None", inline: false }
                )
        ] });
    }
};
