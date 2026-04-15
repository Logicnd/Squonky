const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const embeds = require("../utils/embeds");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("banhammer")
        .setDescription("Ban a user with style.")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(o => o.setName("user").setDescription("User to ban").setRequired(true))
        .addStringOption(o => o.setName("reason").setDescription("Reason").setRequired(false)),
    name: "banhammer",
    description: "Ban a user with style.",
    category: "Admins",
    permissions: [PermissionFlagsBits.BanMembers],
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
        const target = interaction?.options?.getUser("user") ?? ctx.message?.mentions?.users?.first();
        const reason = interaction?.options?.getString("reason") ?? ctx.args?.slice(1).join(" ") ?? "No reason provided.";

        if (!target) return ctx.reply({ embeds: [embeds.warning("Missing Target", "Specify a user to ban.")], ephemeral: true });
        if (!guild) return ctx.reply({ embeds: [embeds.warning("Guild Only", "This command requires a server context.")], ephemeral: true });

        try {
            await guild.members.ban(target.id, { reason });
            return ctx.reply({ embeds: [embeds.danger("User Banned", null, [
                { name: "User", value: `${target.tag} (\`${target.id}\`)`, inline: true },
                { name: "Reason", value: reason, inline: true }
            ])] });
        } catch {
            return ctx.reply({ embeds: [embeds.warning("Ban Failed", "Insufficient permissions or user not found.")], ephemeral: true });
        }
    }
};
