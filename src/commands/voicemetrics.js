const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");
const { getVoiceMetrics } = require("../services/metrics");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("voicemetrics")
        .setDescription("View voice warfare activity statistics."),
    name: "voicemetrics",
    description: "View voice warfare activity statistics.",
    category: "Guest",
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
        const m = getVoiceMetrics();
        const durationMin = Math.floor(m.durationStats.total / 60);
        const durationSec = m.durationStats.total % 60;
        const commandList = Object.entries(m.byCommand).map(([cmd, n]) => `**${cmd}:** ${n}`).join("\n") || "No deployments recorded";
        const guildField = guild && m.byGuild[guild.id]
            ? [{
                name: "This Server",
                value: `Deployments: **${m.byGuild[guild.id]}**\nRank: **#${Object.entries(m.byGuild).sort(([,a],[,b])=>b-a).findIndex(([id])=>id===guild.id)+1}** of ${Object.keys(m.byGuild).length} servers`,
                inline: false
              }]
            : [];

        return ctx.reply({ embeds: [
            embeds.info("Voice Warfare Metrics")
                .addFields(
                    { name: "Deployments", value: `${m.totalDeployments}`, inline: true },
                    { name: "Success Rate", value: `${m.successRate}%`, inline: true },
                    { name: "Unique Users Affected", value: `${m.uniqueUsersAffected}`, inline: true },
                    { name: "Connections", value: `Successful: **${m.connectionStats.successful}**\nFailed: **${m.connectionStats.failed}**\nPeak: **${m.connectionStats.peak}**`, inline: true },
                    { name: "Duration", value: `Total: **${durationMin}m ${durationSec}s**\nAverage: **${m.durationStats.average}s**`, inline: true },
                    { name: "Audio Effects", value: `Ghost Protocol: **${m.audioEffects.ghostProtocol}**\nSonic Warfare: **${m.audioEffects.sonicWarfare}**\nSuppression: **${m.audioEffects.voiceSuppression}**\nTTS Warnings: **${m.audioEffects.ttsWarnings}**`, inline: false },
                    { name: "Command Usage", value: commandList, inline: false },
                    ...guildField
                )
        ] });
    }
};
