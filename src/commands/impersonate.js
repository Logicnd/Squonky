const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("impersonate")
        .setDescription("Send a message masquerading as another user via webhook.")
        .addUserOption(o => o.setName("user").setDescription("User to impersonate").setRequired(true))
        .addStringOption(o => o.setName("message").setDescription("The message to send").setRequired(true)),
    name: "impersonate",
    description: "Impersonate a user via webhook.",
    category: "Owners",
    ownerOnly: true,
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
        const target = interaction?.options?.getUser("user") ?? ctx.message?.mentions?.users?.first();
        const content = interaction?.options?.getString("message") ?? ctx.args?.slice(1).join(" ");

        if (!target || !content) return ctx.reply({ embeds: [embeds.warning("Missing Args", "Need a user and a message.")], ephemeral: true });

        try {
            const webhook = await ctx.channel.createWebhook({ name: target.username, avatar: target.displayAvatarURL() });
            await webhook.send(content);
            await webhook.delete();

            if (ctx.isInteraction) {
                return ctx.reply({ embeds: [embeds.success("Impersonation Sent", `Sent as **${target.tag}**`)], ephemeral: true });
            }
            ctx.message?.delete().catch(() => {});
        } catch {
            return ctx.reply({ embeds: [embeds.warning("Failed", "Missing `Manage Webhooks` permission.")], ephemeral: true });
        }
    }
};
