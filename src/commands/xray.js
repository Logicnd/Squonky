const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
const embeds = require("../utils/embeds");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("xray")
        .setDescription("Reveal hidden channels and permission structure.")
        .setDMPermission(false),
    name: "xray",
    description: "Reveal hidden channels and permission structure.",
    category: "Guest",
    guildOnly: true,
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

        const everyone = guild.roles.everyone;
        const hidden = [], visible = [];

        guild.channels.cache.forEach(ch => {
            if (ch.type === ChannelType.GuildCategory) return;
            const canSee = ch.permissionsFor(everyone)?.has(PermissionFlagsBits.ViewChannel);
            (canSee ? visible : hidden).push(ch);
        });

        // Group hidden by category
        const byCategory = {};
        hidden.forEach(ch => {
            const key = ch.parent?.name ?? "Uncategorized";
            if (!byCategory[key]) byCategory[key] = [];
            byCategory[key].push(ch);
        });

        const hiddenList = Object.entries(byCategory).slice(0, 6)
            .map(([cat, chs]) => `**[${cat.toUpperCase()}]**\n${chs.slice(0, 5).map(c => `└ ${c.name} (\`${c.id}\`)`).join("\n")}`)
            .join("\n") || "None detected";

        return ctx.reply({ embeds: [
            embeds.info("X-Ray Vision Protocol", `Analyzing **${guild.name}** — bypassing standard visibility layers.`)
                .addFields(
                    { name: "Sector Scan", value: `Total: **${guild.channels.cache.size}**\nVisible: **${visible.length}**\nHidden: **${hidden.length}**`, inline: false },
                    { name: `Hidden Nodes (${hidden.length})`, value: hiddenList, inline: false }
                )
        ] });
    }
};
