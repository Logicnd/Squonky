const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");
const { sleep } = require("../utils/shared");

// Merged: ghost.js (single user ghost ping) + ghostping.js (broadcast ghost ping)
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ghost")
        .setDescription("Ghost ping a user — mention then immediately delete.")
        .addUserOption(o => o.setName("user").setDescription("Target user").setRequired(true))
        .addIntegerOption(o => o.setName("count").setDescription("How many times (1–5)").setMinValue(1).setMaxValue(5))
        .addBooleanOption(o => o.setName("broadcast").setDescription("Ping in all text channels (default: false)")),
    name: "ghost",
    description: "Ghost ping a user.",
    category: "Dangerous",
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
        const target = interaction?.options?.getUser("user") ?? ctx.message?.mentions?.users?.first();
        const count = interaction?.options?.getInteger("count") ?? 1;
        const broadcast = interaction?.options?.getBoolean("broadcast") ?? false;

        if (!target) return ctx.reply({ embeds: [embeds.warning("No Target", "Specify a user.")], ephemeral: true });

        await ctx.reply({ embeds: [embeds.danger("Ghost Protocol", `Initiating ghost ping on <@${target.id}>...`, [
            { name: "Mode", value: broadcast ? "Broadcast" : "Single", inline: true },
            { name: "Repeats", value: `${count}`, inline: true }
        ])] });

        const channels = broadcast && guild
            ? [...guild.channels.cache.filter(c => c.type === 0 && c.permissionsFor(ctx.channel?.client?.user)?.has("SendMessages")).values()].slice(0, 5)
            : [ctx.channel];

        for (const ch of channels) {
            for (let i = 0; i < count; i++) {
                const m = await ch.send(`<@${target.id}>`).catch(() => null);
                if (m) await sleep(300).then(() => m.delete().catch(() => {}));
                if (count > 1) await sleep(500);
            }
            if (channels.length > 1) await sleep(1000);
        }
    }
};
