const { SlashCommandBuilder, ChannelType } = require("discord.js");
const embeds = require("../utils/embeds");

// Merged: scramble (channel names) + shuffle (role colors) + spam (create channels)
module.exports = {
    data: new SlashCommandBuilder()
        .setName("chaos")
        .setDescription("Chaos Vector toolkit — scramble, shuffle, or spam.")
        .setDMPermission(false)
        .addSubcommand(sub =>
            sub.setName("scramble")
                .setDescription("Scramble channel names.")
                .addIntegerOption(o => o.setName("intensity").setDescription("Intensity 1–10").setMinValue(1).setMaxValue(10)))
        .addSubcommand(sub =>
            sub.setName("shuffle")
                .setDescription("Randomize role colors.")
                .addIntegerOption(o => o.setName("intensity").setDescription("Intensity 1–10").setMinValue(1).setMaxValue(10)))
        .addSubcommand(sub =>
            sub.setName("spam")
                .setDescription("Spam-create channels.")
                .addIntegerOption(o => o.setName("intensity").setDescription("How many channels (1–10)").setMinValue(1).setMaxValue(10))),
    name: "chaos",
    description: "Chaos Vector toolkit.",
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
        if (!guild) return ctx.reply({ embeds: [embeds.warning("Guild Only", "Requires a server.")], ephemeral: true });

        const sub = interaction?.options?.getSubcommand() ?? ctx.args?.[0] ?? "scramble";
        const intensity = interaction?.options?.getInteger("intensity") ?? parseInt(ctx.args?.[1]) ?? 5;

        if (sub === "scramble") {
            await ctx.reply({ embeds: [embeds.warning("Chaos — Scramble", `Intensity: **${intensity}/10** — Scrambling channel names...`)] });
            guild.channels.cache.forEach(ch => {
                if (!ch?.name) return;
                if (Math.random() * 10 < intensity) {
                    const scrambled = Array.from(ch.name).sort(() => Math.random() - 0.5).join("");
                    ch.setName(scrambled).catch(() => {});
                }
            });
            return;
        }

        if (sub === "shuffle") {
            await ctx.reply({ embeds: [embeds.warning("Chaos — Shuffle", `Intensity: **${intensity}/10** — Randomizing role colors...`)] });
            guild.roles.cache.forEach(role => {
                if (role.editable && role.id !== guild.id && Math.random() * 10 < intensity) {
                    role.setColor(Math.floor(Math.random() * 0xFFFFFF)).catch(() => {});
                }
            });
            return;
        }

        if (sub === "spam") {
            await ctx.reply({ embeds: [embeds.warning("Chaos — Spam", `Creating **${intensity}** channels...`)] });
            for (let i = 0; i < intensity; i++) {
                guild.channels.create({ name: `error-${Math.floor(Math.random() * 1000)}`, type: ChannelType.GuildText }).catch(() => {});
            }
            return;
        }

        return ctx.reply({ embeds: [embeds.warning("Unknown Subcommand", "Use: `scramble`, `shuffle`, or `spam`")], ephemeral: true });
    }
};
