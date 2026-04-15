const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Display detailed information about a user.")
        .addUserOption(o => o.setName("user").setDescription("Target user (defaults to you)").setRequired(false)),
    name: "userinfo",
    description: "Display user info.",
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
        const target = interaction?.options?.getUser("user") ?? ctx.user;
        const member = guild?.members?.cache.get(target.id);
        const createdAt = `<t:${Math.floor(target.createdTimestamp / 1000)}:F>`;
        const joinedAt = member?.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` : "N/A";
        const roles = member?.roles?.cache
            .filter(r => r.id !== guild?.id)
            .sort((a, b) => b.position - a.position)
            .map(r => `<@&${r.id}>`)
            .slice(0, 8)
            .join(" ") || "None";

        return ctx.reply({ embeds: [
            embeds.info(`User — ${target.tag}`)
                .setThumbnail(target.displayAvatarURL({ size: 256 }))
                .addFields(
                    { name: "ID", value: `\`${target.id}\``, inline: true },
                    { name: "Bot", value: target.bot ? "Yes" : "No", inline: true },
                    { name: "Nickname", value: member?.nickname ?? "None", inline: true },
                    { name: "Account Created", value: createdAt, inline: false },
                    { name: "Joined Server", value: joinedAt, inline: false },
                    { name: "Roles", value: roles, inline: false }
                )
        ] });
    }
};
