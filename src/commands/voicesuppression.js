const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");
const { requireDangerousAuth } = require("../utils/dangerousAuth");
const { sleep } = require("../utils/shared");

// BUG FIX: Old version had 8 nearly identical deploy functions (deployAllChannels, deployChannel,
// deployMutedVoice, etc.) each duplicating the same joinVoiceChannel + mute logic.
// Now: single parameterized deployVoice() handles all modes.

async function deployVoice(guild, ctx, options = {}) {
    const { joinVoiceChannel } = require("@discordjs/voice");
    const { PermissionFlagsBits } = require("discord.js");
    const { targetChannelId = null, muteMembers = false, durationMs = 5000, mode = "standard" } = options;

    const voiceChannels = targetChannelId
        ? guild.channels.cache.filter(c => c.type === 2 && c.id === targetChannelId)
        : guild.channels.cache.filter(c => c.type === 2);

    let deployed = 0, affected = 0;

    for (const [, ch] of voiceChannels) {
        let conn = null;
        try {
            conn = joinVoiceChannel({ channelId: ch.id, guildId: guild.id, adapterCreator: guild.voiceAdapterCreator });
            deployed++;

            if (muteMembers) {
                for (const [, member] of ch.members.filter(m => !m.user.bot)) {
                    const canMute = guild.members.me.permissions.has(PermissionFlagsBits.MuteMembers);
                    if (canMute) {
                        await member.voice.setMute(true, `Voice suppression — mode: ${mode}`).catch(() => {});
                        affected++;
                    }
                }
            }

            await sleep(durationMs);
        } catch { /* channel inaccessible */ }
        finally { conn?.destroy(); }

        await sleep(500);
    }

    return { deployed, affected };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("voicesuppression")
        .setDescription("Join all voice channels and server-mute every member.")
        .setDMPermission(false)
        .addStringOption(o =>
            o.setName("mode").setDescription("Suppression mode").setRequired(false)
                .addChoices(
                    { name: "All Channels", value: "all" },
                    { name: "Largest Channel Only", value: "largest" }
                ))
        .addIntegerOption(o => o.setName("duration").setDescription("Hold duration per channel in seconds (1–30)").setMinValue(1).setMaxValue(30)),
    name: "voicesuppression",
    description: "Join all voice channels and mute everyone.",
    category: "Dangerous",
    ownerOnly: true,
    guildOnly: true,
    async execute({ ctx, interaction, guild, config }) {
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
        const mode = interaction?.options?.getString("mode") ?? "all";
        const duration = (interaction?.options?.getInteger("duration") ?? 5) * 1000;

        await requireDangerousAuth(ctx, "voicesuppression", async () => {
            let targetChannelId = null;

            if (mode === "largest") {
                const largest = [...guild.channels.cache.filter(c => c.type === 2).values()]
                    .sort((a, b) => b.members.size - a.members.size)[0];
                targetChannelId = largest?.id ?? null;
            }

            const voiceChannels = guild.channels.cache.filter(c => c.type === 2 && (targetChannelId ? c.id === targetChannelId : true));

            await ctx.channel.send({ embeds: [embeds.danger("Voice Suppression", `Mode: **${mode.toUpperCase()}** — deploying to **${voiceChannels.size}** channel(s)...`)] });

            const { deployed, affected } = await deployVoice(guild, ctx, { targetChannelId, muteMembers: true, durationMs: duration, mode });

            await ctx.channel.send({ embeds: [embeds.success("Suppression Complete", null, [
                { name: "Channels Breached", value: `${deployed}`, inline: true },
                { name: "Members Muted", value: `${affected}`, inline: true }
            ])] });
        }, config);
    }
};
