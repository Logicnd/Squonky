const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const embeds = require("../utils/embeds");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Bulk delete messages from this channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(o =>
            o.setName("amount")
                .setDescription("Number of messages to delete (1–100)")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)),
    name: "purge",
    description: "Bulk delete messages.",
    category: "Admins",
    permissions: [PermissionFlagsBits.ManageMessages],
    async execute({ ctx, interaction }) {
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
        const amount = interaction?.options?.getInteger("amount") ?? parseInt(ctx.args?.[0]) ?? 10;
        const channel = ctx.channel;

        if (!channel) return;

        try {
            const deleted = await channel.bulkDelete(amount, true);
            const confirm = await ctx.reply({ embeds: [embeds.success("Purge Complete", null, [
                { name: "Deleted", value: `${deleted.size} message(s)`, inline: true },
                { name: "Channel", value: `<#${channel.id}>`, inline: true }
            ])] });

            setTimeout(() => confirm?.delete?.().catch(() => {}), 4000);
        } catch {
            return ctx.reply({ embeds: [embeds.warning("Purge Failed", "Messages may be too old (14+ days) or I lack permissions.")], ephemeral: true });
        }
    }
};
