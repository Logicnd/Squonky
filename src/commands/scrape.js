const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");
const { sleep } = require("../utils/shared");

// Fix: was importing from a broken path in the old version.
module.exports = {
    data: new SlashCommandBuilder()
        .setName("scrape")
        .setDescription("Scrape member metadata from this server.")
        .setDMPermission(false)
        .addIntegerOption(o =>
            o.setName("limit")
                .setDescription("Max members to scrape (default 50, max 200)")
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(200)),
    name: "scrape",
    description: "Scrape member metadata.",
    category: "Guest",
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
        if (!guild) return ctx.reply({ embeds: [embeds.warning("Guild Only", "Run in a server.")], ephemeral: true });

        const limit = interaction?.options?.getInteger("limit") ?? 50;
        await ctx.reply({ embeds: [embeds.neutral("Scraping...", `Fetching up to **${limit}** members.`)] });

        let members;
        try {
            members = await guild.members.fetch({ limit });
        } catch {
            return ctx.reply({ embeds: [embeds.warning("Fetch Failed", "Could not retrieve member list.")] });
        }

        const subset = [...members.values()].slice(0, limit);
        const bots = subset.filter(m => m.user.bot).length;
        const humans = subset.length - bots;
        const newest = subset.sort((a, b) => b.joinedTimestamp - a.joinedTimestamp)[0];
        const oldest = subset.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)[0];

        return ctx.reply({ embeds: [
            embeds.info(`Scrape Complete — ${guild.name}`)
                .addFields(
                    { name: "Scraped", value: `**${subset.length}** members`, inline: true },
                    { name: "Humans", value: `${humans}`, inline: true },
                    { name: "Bots", value: `${bots}`, inline: true },
                    { name: "Most Recent Join", value: newest ? `**${newest.user.tag}** — <t:${Math.floor(newest.joinedTimestamp / 1000)}:R>` : "N/A", inline: false },
                    { name: "Earliest Join", value: oldest ? `**${oldest.user.tag}** — <t:${Math.floor(oldest.joinedTimestamp / 1000)}:R>` : "N/A", inline: false }
                )
        ] });
    }
};
