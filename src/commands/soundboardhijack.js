const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");
const { requireDangerousAuth } = require("../utils/dangerousAuth");
const { sleep } = require("../utils/shared");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("soundboardhijack")
        .setDescription("Join a voice channel and simulate soundboard audio injection.")
        .setDMPermission(false)
        .addChannelOption(o => o.setName("channel").setDescription("Target voice channel").setRequired(true)),
    name: "soundboardhijack",
    description: "Simulate soundboard hijack in a voice channel.",
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
        const channel = interaction?.options?.getChannel("channel");
        if (!channel || channel.type !== 2) return ctx.reply({ embeds: [embeds.warning("Invalid Channel", "Must be a voice channel.")], ephemeral: true });

        await requireDangerousAuth(ctx, "soundboardhijack", async () => {
            const { joinVoiceChannel } = require("@discordjs/voice");

            await ctx.channel.send({ embeds: [embeds.danger("Soundboard Hijack", `Connecting to **#${channel.name}**...`)] });

            let conn;
            try {
                conn = joinVoiceChannel({ channelId: channel.id, guildId: guild.id, adapterCreator: guild.voiceAdapterCreator });
            } catch {
                return ctx.channel.send({ embeds: [embeds.warning("Connection Failed", "Could not join voice channel.")] });
            }

            const sounds = ["airhorn", "vine boom", "vine boom", "metal pipe", "discord ringtone"];
            for (const sound of sounds) {
                await sleep(1500);
                await ctx.channel.send({ embeds: [embeds.neutral("Soundboard Hijack", `Playing: **${sound}**`)] });
            }

            conn.destroy();
            await ctx.channel.send({ embeds: [embeds.success("Hijack Complete", `Disconnected from **#${channel.name}**`)] });
        }, config);
    }
};
