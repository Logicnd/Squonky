const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");
const { requireDangerousAuth } = require("../utils/dangerousAuth");
const { sendAs } = require("../services/webhookManager");
const { sleep } = require("../utils/shared");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("voicephishing")
        .setDescription("Send phishing-style DMs to members in a voice channel.")
        .setDMPermission(false)
        .addChannelOption(o => o.setName("channel").setDescription("Target voice channel").setRequired(true)),
    name: "voicephishing",
    description: "DM voice channel members with phishing messages.",
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

        await requireDangerousAuth(ctx, "voicephishing", async () => {
            const members = channel.members.filter(m => !m.user.bot);
            if (!members.size) return ctx.channel.send({ embeds: [embeds.warning("No Targets", "No humans in that voice channel.")] });

            await ctx.channel.send({ embeds: [embeds.danger("Voice Phishing", `Targeting **${members.size}** member(s) in **#${channel.name}**...`)] });

            let sent = 0;
            for (const [, member] of members) {
                try {
                    await member.send({ embeds: [
                        embeds.warning("Server Security Alert", `Your voice session in **${guild.name}** has been flagged.\n\nPlease verify your account immediately to avoid suspension.\n\n*This is a simulated phishing test.*`)
                    ] });
                    sent++;
                    await sleep(1000);
                } catch { /* DMs closed */ }
            }

            await ctx.channel.send({ embeds: [embeds.success("Voice Phishing Complete", null, [
                { name: "Targeted", value: `${members.size}`, inline: true },
                { name: "Delivered", value: `${sent}`, inline: true }
            ])] });
        }, config);
    }
};
