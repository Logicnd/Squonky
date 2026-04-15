const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const embeds = require("../utils/embeds");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lockdown")
        .setDescription("Toggle channel lockdown — remove or restore @everyone send permission.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption(o =>
            o.setName("mode")
                .setDescription("Lock or unlock")
                .setRequired(true)
                .addChoices({ name: "Lock", value: "lock" }, { name: "Unlock", value: "unlock" })),
    name: "lockdown",
    description: "Toggle channel lockdown.",
    category: "Admins",
    permissions: [PermissionFlagsBits.ManageChannels],
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
        const mode = interaction?.options?.getString("mode") ?? (ctx.args?.[0]?.toLowerCase() ?? "lock");
        const channel = ctx.channel;

        if (!guild || !channel) return ctx.reply({ embeds: [embeds.warning("Guild Only", "Requires a server channel.")], ephemeral: true });

        const deny = mode === "lock";

        try {
            await channel.permissionOverwrites.edit(guild.roles.everyone, {
                SendMessages: deny ? false : null
            });

            return ctx.reply({ embeds: [
                deny
                    ? embeds.danger("Channel Locked", `<#${channel.id}> is now in lockdown. No one can send messages.`)
                    : embeds.success("Channel Unlocked", `<#${channel.id}> lockdown lifted.`)
            ] });
        } catch {
            return ctx.reply({ embeds: [embeds.warning("Failed", "Missing Manage Channel permissions.")], ephemeral: true });
        }
    }
};
