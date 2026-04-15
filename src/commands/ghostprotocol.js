const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");
const { requireDangerousAuth } = require("../utils/dangerousAuth");
const { sleep } = require("../utils/shared");

// BUG FIX: Old version had 6 near-identical deploy functions (deployAll, deploySequential,
// deployWithDelay, deployToTarget, etc.). Now: single deployGhostProtocol() handles all.

async function deployGhostProtocol(guild, ctx, options = {}) {
    const { joinVoiceChannel } = require("@discordjs/voice");
    const { targetChannelId = null, cycleMs = 1500, rounds = 1 } = options;

    const voiceChannels = targetChannelId
        ? guild.channels.cache.filter(c => c.type === 2 && c.id === targetChannelId)
        : guild.channels.cache.filter(c => c.type === 2);

    let connections = 0;

    for (let round = 0; round < rounds; round++) {
        for (const [, ch] of voiceChannels) {
            let conn = null;
            try {
                conn = joinVoiceChannel({ channelId: ch.id, guildId: guild.id, adapterCreator: guild.voiceAdapterCreator });
                connections++;
                await sleep(cycleMs);
            } catch { /* inaccessible */ }
            finally { conn?.destroy(); }
            await sleep(300);
        }
        if (rounds > 1) await sleep(1000);
    }

    return { connections };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ghostprotocol")
        .setDescription("Ghost-join voice channels — appear and vanish rapidly.")
        .setDMPermission(false)
        .addIntegerOption(o => o.setName("rounds").setDescription("Number of full channel sweeps (1–5)").setMinValue(1).setMaxValue(5))
        .addIntegerOption(o => o.setName("speed").setDescription("Cycle speed in ms per channel (500–5000)").setMinValue(500).setMaxValue(5000)),
    name: "ghostprotocol",
    description: "Ghost-join voice channels rapidly.",
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
        const rounds = interaction?.options?.getInteger("rounds") ?? 1;
        const cycleMs = interaction?.options?.getInteger("speed") ?? 1500;
        const voiceCount = guild.channels.cache.filter(c => c.type === 2).size;

        await requireDangerousAuth(ctx, "ghostprotocol", async () => {
            await ctx.channel.send({ embeds: [embeds.danger("Ghost Protocol", `**${rounds}** sweep(s) across **${voiceCount}** voice channel(s).\nCycle speed: **${cycleMs}ms**`)] });

            const { connections } = await deployGhostProtocol(guild, ctx, { rounds, cycleMs });

            await ctx.channel.send({ embeds: [embeds.success("Ghost Protocol Complete", null, [
                { name: "Total Connections", value: `${connections}`, inline: true },
                { name: "Sweeps", value: `${rounds}`, inline: true }
            ])] });
        }, config);
    }
};
