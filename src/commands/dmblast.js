const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dmblast")
        .setDescription("Send a simulated alert to random members.")
        .setDMPermission(false)
        .addIntegerOption(o =>
            o.setName("intensity").setDescription("How many members to DM (1–10)").setRequired(false).setMinValue(1).setMaxValue(10)),
    name: "dmblast",
    description: "DM blast random members.",
    category: "Owners",
    ownerOnly: true,
    guildOnly: true,
    async execute({ ctx, interaction, guild }) {
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
        const intensity = interaction?.options?.getInteger("intensity") ?? parseInt(ctx.args?.[0]) ?? 5;
        const humans = guild.members.cache.filter(m => !m.user.bot);
        const targets = [...humans.values()].sort(() => Math.random() - 0.5).slice(0, intensity);

        if (!targets.length) return ctx.reply({ embeds: [embeds.warning("No Targets", "No members available.")], ephemeral: true });

        await ctx.reply({ embeds: [embeds.neutral("DM Blast", `Transmitting to **${targets.length}** member(s)...`)] });

        let sent = 0;
        for (const member of targets) {
            try {
                await member.send({ embeds: [embeds.danger("R3D ALERT", "You have been marked.")] });
                sent++;
            } catch { /* DMs closed */ }
        }

        return ctx.reply({ embeds: [embeds.success("DM Blast Complete", null, [
            { name: "Targeted", value: `${targets.length}`, inline: true },
            { name: "Delivered", value: `${sent}`, inline: true },
            { name: "Failed", value: `${targets.length - sent}`, inline: true }
        ])] });
    }
};
