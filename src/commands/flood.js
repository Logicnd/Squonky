const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");
const { storeInterval, dropInterval, hasInterval } = require("../services/stateStore");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("flood")
        .setDescription("Flood a channel with repeated messages, or stop flooding.")
        .setDMPermission(true)
        .addSubcommand(sub =>
            sub.setName("start")
                .setDescription("Start flooding the current channel.")
                .addStringOption(o => o.setName("message").setDescription("Message to repeat").setRequired(true))
                .addIntegerOption(o => o.setName("interval").setDescription("Interval in seconds (default 3)").setMinValue(1).setMaxValue(60)))
        .addSubcommand(sub =>
            sub.setName("stop")
                .setDescription("Stop flooding.")),
    name: "flood",
    description: "Flood a channel or stop flooding.",
    category: "Owners",
    ownerOnly: true,
    guildOnly: false,
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
        const sub = interaction?.options?.getSubcommand() ?? ctx.args?.[0] ?? "start";
        const channel = ctx.channel;
        if (!channel || !channel.send) {
            return ctx.reply({ content: "This channel does not support flooding operations.", ephemeral: true });
        }
        const key = `flood_${channel.id}`;

        if (sub === "stop") {
            if (!hasInterval(key)) return ctx.reply({ embeds: [embeds.muted("Flood Stop", "No active flood on this channel.")], ephemeral: true });
            dropInterval(key);
            return ctx.reply({ embeds: [embeds.success("Flood Stopped", "Channel flood terminated.")] });
        }

        if (hasInterval(key)) return ctx.reply({ embeds: [embeds.warning("Already Flooding", "Stop the current flood first with `/flood stop`.")], ephemeral: true });

        const msg = interaction?.options?.getString("message") ?? ctx.args?.slice(1).join(" ") ?? "R3D FLOOD";
        const intervalSec = interaction?.options?.getInteger("interval") ?? 3;

        await ctx.reply({ embeds: [embeds.warning("Flood Started", `Flooding <#${channel.id}> every **${intervalSec}s**.\nUse \`/flood stop\` to halt.`)] });

        const id = setInterval(() => {
            channel.send(msg).catch((err) => {
                console.error(`Flood failed in ${channel.id}:`, err);
                dropInterval(key);
            });
        }, intervalSec * 1000);

        storeInterval(key, id);
    }
};
