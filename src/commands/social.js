const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");
const SocialEngineeringModule = require("../modules/socialEngineering");

const OPERATIONS = ["trust", "divide", "chaos", "infiltrate"];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("social")
        .setDescription("Run a social engineering operation across server channels.")
        .setDMPermission(false)
        .addStringOption(o =>
            o.setName("operation").setDescription("Operation type").setRequired(true)
                .addChoices(...OPERATIONS.map(op => ({ name: op.charAt(0).toUpperCase() + op.slice(1), value: op })))),
    name: "social",
    description: "Run a social engineering operation.",
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
        const operation = interaction?.options?.getString("operation") ?? ctx.args?.[0];

        if (!operation) return ctx.reply({ embeds: [embeds.warning("Missing Operation", `Valid ops: ${OPERATIONS.join(", ")}`)], ephemeral: true });

        const mod = new SocialEngineeringModule(config, logger);
        const source = interaction ?? message;
        await mod.execute(source, operation);
    }
};
