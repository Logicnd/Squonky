const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");
const { sleep } = require("../utils/shared");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("recon")
        .setDescription("Run an OSINT recon sweep on a user.")
        .addUserOption(o => o.setName("target").setDescription("Target user").setRequired(true)),
    name: "recon",
    description: "OSINT recon sweep.",
    category: "Guest",
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
        const target = interaction?.options?.getUser("target") ?? ctx.message?.mentions?.users?.first();
        if (!target) return ctx.reply({ embeds: [embeds.warning("No Target", "Specify a user.")], ephemeral: true });

        const member = guild?.members?.cache.get(target.id);
        const steps = [
            `> Initializing recon on ${target.tag}...`,
            `> Scanning profile fingerprint...`,
            `> Resolving account age...`,
            `> Mapping guild presence...`,
            `> Extracting role topology...`,
            `> Recon complete.`
        ];

        const embed = embeds.info("Recon Protocol — Initializing").setDescription("```\n> Establishing uplink...\n```");

        let msg = null;
        for (const step of steps) {
            const lines = steps.slice(0, steps.indexOf(step) + 1).join("\n");
            const updated = embeds.info("Recon Protocol").setDescription("```\n" + lines + "\n```");
            if (!msg) {
                msg = await ctx.reply({ embeds: [updated], fetchReply: true }).catch(() => ctx.reply({ embeds: [updated] }));
            } else {
                await msg.edit({ embeds: [updated] }).catch(() => {});
            }
            await sleep(600);
        }

        const createdAt = `<t:${Math.floor(target.createdTimestamp / 1000)}:F>`;
        const joinedAt = member?.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` : "Not in server";
        const roles = member?.roles?.cache.filter(r => r.id !== guild?.id).map(r => r.name).join(", ") || "None";

        return msg?.edit({ embeds: [
            embeds.info(`Recon Complete — ${target.tag}`)
                .setThumbnail(target.displayAvatarURL({ size: 256 }))
                .addFields(
                    { name: "User ID", value: `\`${target.id}\``, inline: true },
                    { name: "Bot", value: target.bot ? "Yes" : "No", inline: true },
                    { name: "Account Created", value: createdAt, inline: false },
                    { name: "Joined Server", value: joinedAt, inline: false },
                    { name: "Roles", value: roles || "None", inline: false }
                )
        ] }).catch(() => {});
    }
};
