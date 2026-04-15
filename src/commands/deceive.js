const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require("discord.js");
const embeds = require("../utils/embeds");
const { sendAs } = require("../services/webhookManager");

const TEMPLATES = {
    nitro: {
        build: (guild) => embeds.info("You've been gifted a subscription!", `**${guild?.members?.me?.displayName ?? "R3D"}** sent you a gift for **Discord Nitro**!\n\nExpires in **24 hours**.\n[Click here to claim](https://discord.com/nitro)`)
            .setThumbnail("https://i.imgur.com/w9e45Zg.png"),
        button: { id: "deceive_nitro", label: "Accept", style: ButtonStyle.Success }
    },
    verify: {
        build: () => embeds.danger("Security Action Required", "We detected unusual activity on your account. Access has been temporarily restricted.\n\nPlease verify your identity immediately."),
        button: { id: "deceive_verify", label: "Verify Identity", style: ButtonStyle.Danger }
    },
    system: {
        build: () => embeds.neutral("System Message", "**Server Update:** A new security patch has been deployed. All users must acknowledge the new ToS."),
        button: { id: "deceive_tos", label: "Acknowledge", style: ButtonStyle.Primary }
    },
    mod: {
        build: (guild) => embeds.success("Moderator Applications Open", "We are looking for new staff! Click below to apply. Fast track processing enabled.")
            .setThumbnail(guild?.iconURL() ?? null),
        button: { id: "deceive_mod", label: "Apply Now", style: ButtonStyle.Secondary }
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deceive")
        .setDescription("Generate a deceptive social engineering payload.")
        .addStringOption(o =>
            o.setName("template").setDescription("Template type").setRequired(true)
                .addChoices(
                    { name: "Fake Nitro Gift", value: "nitro" },
                    { name: "Security Verification", value: "verify" },
                    { name: "System Announcement", value: "system" },
                    { name: "Mod Application", value: "mod" }
                )),
    name: "deceive",
    description: "Generate a social engineering payload.",
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
        const templateKey = interaction?.options?.getString("template") ?? ctx.args?.[0] ?? "system";
        const template = TEMPLATES[templateKey];
        if (!template) return ctx.reply({ embeds: [embeds.warning("Unknown Template", `Valid: ${Object.keys(TEMPLATES).join(", ")}`)], ephemeral: true });

        const embed = template.build(guild);
        const btn = new ButtonBuilder().setCustomId(template.button.id).setLabel(template.button.label).setStyle(template.button.style);
        const row = new ActionRowBuilder().addComponents(btn);

        const msg = await ctx.channel.send({ embeds: [embed], components: [row] });

        if (ctx.isInteraction) {
            await interaction.editReply({ content: "Payload delivered.", embeds: [], components: [] }).catch(() => {});
        } else {
            ctx.message?.delete().catch(() => {});
        }

        // Log click — 10 minute window
        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 600_000 });
        collector.on("collect", async i => {
            console.log(`[DECEIVE] ${i.user.tag} (${i.user.id}) clicked ${i.customId}`);
            await i.reply({ content: `OPSEC failure logged. User: **${i.user.tag}**\nID: \`${i.user.id}\`\n\nThis was a penetration test.`, ephemeral: true });
        });
    }
};
