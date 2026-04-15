const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");
const { requireDangerousAuth } = require("../utils/dangerousAuth");
const { storeInterval, dropInterval, hasInterval } = require("../services/stateStore");
const { sleep } = require("../utils/shared");

// BUG FIX: Old version had `connection` variable declared inside the setInterval callback
// but referenced outside it (scope issue). Now the interval key pattern + stateStore is used.

module.exports = {
    data: new SlashCommandBuilder()
        .setName("voicesiege")
        .setDescription("Continuously cycle through all voice channels, disrupting presence.")
        .setDMPermission(false)
        .addSubcommand(sub => sub.setName("start").setDescription("Begin the siege."))
        .addSubcommand(sub => sub.setName("stop").setDescription("End the siege.")),
    name: "voicesiege",
    description: "Cycle through all voice channels continuously.",
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
        const sub = interaction?.options?.getSubcommand() ?? ctx.args?.[0] ?? "start";
        const key = `voicesiege_${guild?.id}`;

        if (sub === "stop") {
            if (!hasInterval(key)) return ctx.reply({ embeds: [embeds.muted("No Active Siege", "No siege is running on this server.")], ephemeral: true });
            dropInterval(key);
            return ctx.reply({ embeds: [embeds.success("Siege Ended", "Voice channel siege terminated.")] });
        }

        if (hasInterval(key)) return ctx.reply({ embeds: [embeds.warning("Siege Active", "A siege is already running. Use `/voicesiege stop` first.")], ephemeral: true });

        await requireDangerousAuth(ctx, "voicesiege", async () => {
            const { joinVoiceChannel } = require("@discordjs/voice");

            const voiceChannels = [...(guild?.channels?.cache?.filter(c => c.type === 2)?.values() ?? [])];
            if (!voiceChannels.length) return ctx.channel.send({ embeds: [embeds.warning("No Voice Channels", "Nothing to siege.")] });

            await ctx.channel.send({ embeds: [embeds.danger("Voice Siege Active", `Cycling across **${voiceChannels.length}** voice channels.\nUse \`/voicesiege stop\` to halt.`)] });

            let idx = 0;
            // Each tick: join next channel, hold 2s, leave
            const tick = async () => {
                const ch = voiceChannels[idx % voiceChannels.length];
                idx++;
                try {
                    const conn = joinVoiceChannel({ channelId: ch.id, guildId: guild.id, adapterCreator: guild.voiceAdapterCreator });
                    await sleep(2000);
                    conn.destroy();
                } catch { /* channel may be full or restricted */ }
            };

            // Run first tick immediately
            await tick();

            const intervalId = setInterval(async () => {
                if (!hasInterval(key)) return; // safety check
                await tick();
            }, 3000);

            storeInterval(key, intervalId);
        }, config);
    }
};
