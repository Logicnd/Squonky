const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Make the bot send a message.")
        .addStringOption(o => o.setName("message").setDescription("What to say").setRequired(true))
        .addChannelOption(o => o.setName("channel").setDescription("Target channel (defaults to current)").setRequired(false)),
    name: "say",
    description: "Send a message as the bot.",
    category: "Guest",
    async execute({ ctx, interaction }) {
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
        const text = interaction?.options?.getString("message") ?? ctx.args?.join(" ");
        const channel = interaction?.options?.getChannel("channel") ?? ctx.channel;

        if (!text) return ctx.reply({ embeds: [embeds.warning("Empty Message", "Provide a message.")], ephemeral: true });

        try {
            await channel.send(text);
            if (ctx.isInteraction) {
                return ctx.reply({ embeds: [embeds.success("Sent", `Message delivered to <#${channel.id}>`)], ephemeral: true });
            }
            ctx.message?.delete().catch(() => {});
        } catch {
            return ctx.reply({ embeds: [embeds.warning("Failed", "Cannot send to that channel.")], ephemeral: true });
        }
    }
};
