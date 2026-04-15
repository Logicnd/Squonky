const { SlashCommandBuilder, ChannelType } = require("discord.js");
const embeds = require("../utils/embeds");
const { sendAs } = require("../services/webhookManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("blackout")
        .setDescription("TOTAL SENSORY DEPRIVATION — delete all channels except one.")
        .setDMPermission(false),
    name: "blackout",
    description: "Delete all channels except one.",
    category: "Owners",
    ownerOnly: true,
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
        if (!guild) return ctx.reply({ embeds: [embeds.warning("Guild Only", "Requires a server.")], ephemeral: true });

        const { PermissionFlagsBits } = require("discord.js");
        if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return ctx.reply({ embeds: [embeds.warning(
                "Blackout — Simulation",
                "SIMULATION ACTIVE: All channels would be deleted and replaced with **#the-void**.\n\n*Bot lacks `Manage Channels` permission.*"
            )] });
        }

        const voidChannel = await guild.channels.create({ name: "the-void", type: ChannelType.GuildText, topic: "Where light goes to die." });
        guild.channels.cache.forEach(ch => { if (ch.id !== voidChannel.id) ch.delete().catch(() => {}); });

        await sendAs(voidChannel, "THE SHADOW", null, { embeds: [
            embeds.danger("BLACKOUT INITIATED", "All communication nodes have been severed.\nWelcome to the darkness.")
        ] });

        return ctx.reply({ content: `Blackout complete. <#${voidChannel.id}>` });
    }
};
