const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const embeds = require("../utils/embeds");
const { sendAs } = require("../services/webhookManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("subjugate")
        .setDescription("Grant Administrator role to a user (OVERLORD protocol).")
        .addUserOption(o => o.setName("user").setDescription("The chosen one").setRequired(true)),
    name: "subjugate",
    description: "Grant Administrator to a user.",
    category: "Owners",
    ownerOnly: true,
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
        if (!target) return ctx.reply({ embeds: [embeds.warning("No Target", "Specify a user.")], ephemeral: true });
        if (!guild) return ctx.reply({ embeds: [embeds.warning("Guild Only", "Requires a server.")], ephemeral: true });

        if (!guild.members.me.permissions.has(PermissionFlagsBits.Administrator)) {
            return ctx.reply({ embeds: [embeds.warning(
                "Subjugation — Simulation",
                `SIMULATION: <@${target.id}> would have been granted **Administrator**.\n\n*Bot lacks Administrator permission.*`
            )] });
        }

        try {
            const role = await guild.roles.create({ name: "OVERLORD", color: 0xFF0000, permissions: [PermissionFlagsBits.Administrator], reason: "SUBJUGATION PROTOCOL" });
            const member = await guild.members.fetch(target.id);
            await member.roles.add(role);

            await sendAs(ctx.channel, "KINGMAKER", null, { embeds: [
                embeds.danger("New Ruler Appointed", `<@${target.id}> has been granted **ABSOLUTE CONTROL**.`)
            ] });
        } catch {
            return ctx.reply({ embeds: [embeds.warning("Failed", "Bot likely lacks permissions.")], ephemeral: true });
        }
    }
};
