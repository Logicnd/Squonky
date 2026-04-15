const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");
const { requireDangerousAuth } = require("../utils/dangerousAuth");
const { sleep } = require("../utils/shared");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("exterminate")
        .setDescription("Kick all non-admin, non-bot members from the server.")
        .setDMPermission(false),
    name: "exterminate",
    description: "Mass kick all non-admin members.",
    category: "Dangerous",
    ownerOnly: true,
    guildOnly: true,
    async execute({ ctx, guild, config }) {
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
        await requireDangerousAuth(ctx, "exterminate", async () => {
            const { PermissionFlagsBits } = require("discord.js");
            if (!guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
                return ctx.channel.send({ embeds: [embeds.warning("Exterminate — Simulation", "Bot lacks `Kick Members` permission.")] });
            }

            const targets = guild.members.cache.filter(m =>
                !m.user.bot &&
                !m.permissions.has(PermissionFlagsBits.Administrator) &&
                m.kickable
            );

            await ctx.channel.send({ embeds: [embeds.danger("Extermination Protocol", `Targeting **${targets.size}** member(s)...`)] });

            let kicked = 0;
            for (const [, member] of targets) {
                await member.kick("EXTERMINATION PROTOCOL").catch(() => {});
                kicked++;
                if (kicked % 5 === 0) await sleep(1000);
            }

            await ctx.channel.send({ embeds: [embeds.success("Extermination Complete", null, [
                { name: "Kicked", value: `${kicked}`, inline: true },
                { name: "Skipped", value: `${targets.size - kicked}`, inline: true }
            ])] });
        }, config);
    }
};
