const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");
const DeepfakeModule = require("../modules/deepfake");

const PERSONALITIES = ["aggressive", "submissive", "paranoid", "confident", "unstable"];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deepfake")
        .setDescription("Project a fake personality onto a target user across channels.")
        .setDMPermission(false)
        .addUserOption(o => o.setName("target").setDescription("Target user").setRequired(true))
        .addStringOption(o =>
            o.setName("personality").setDescription("Personality type to project").setRequired(true)
                .addChoices(...PERSONALITIES.map(p => ({ name: p.charAt(0).toUpperCase() + p.slice(1), value: p })))),
    name: "deepfake",
    description: "Project a fake personality onto a target.",
    category: "Modules",
    ownerOnly: true,
    async execute({ ctx, interaction, message, config, logger }) {
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
        const target = interaction?.options?.getUser("target") ?? message?.mentions?.users?.first();
        const personality = interaction?.options?.getString("personality") ?? ctx.args?.[1];

        if (!target || !personality) return ctx.reply({ embeds: [embeds.warning("Missing Args", `Need a target and personality: ${PERSONALITIES.join(", ")}`)], ephemeral: true });

        const mod = new DeepfakeModule(config, logger);
        const source = interaction ?? message;
        await mod.execute(source, target.toString(), personality);
    }
};
