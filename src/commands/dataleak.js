const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const embeds = require("../utils/embeds");
const { sleep } = require("../utils/shared");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dataleak")
        .setDescription("Simulate a full server data extraction.")
        .setDMPermission(false)
        .addIntegerOption(o =>
            o.setName("intensity").setDescription("Simulation depth (1–10)").setRequired(false).setMinValue(1).setMaxValue(10)),
    name: "dataleak",
    description: "Simulate a server data extraction.",
    category: "Owners",
    ownerOnly: true,
    guildOnly: true,
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
        if (!guild) return ctx.reply({ content: "This simulation is only compatible with server environments." });
        const intensity = interaction?.options?.getInteger("intensity") ?? parseInt(ctx.args?.[0]) ?? 5;

        await ctx.reply({ embeds: [embeds.neutral("Data Extraction", `Intensity: **${intensity}/10**\nInitializing server dump...`)] });

        const owner = await guild.fetchOwner().catch(() => null);
        let dump = `SERVER DUMP: ${guild.name} (${guild.id})\n`;
        dump += `DATE: ${new Date().toISOString()}\n`;
        dump += `OWNER: ${owner?.user?.tag ?? "Unknown"}\n`;
        dump += "─".repeat(40) + "\n\n";

        dump += "[CHANNELS]\n";
        guild.channels.cache.forEach(ch => { dump += `${ch.type} | ${ch.name} (${ch.id})\n`; });

        dump += "\n[ROLES]\n";
        guild.roles.cache.forEach(r => { dump += `${r.name} (${r.id}) — ${r.hexColor}\n`; });

        dump += "\n[MEMBERS] (Top 100)\n";
        const members = await guild.members.fetch().catch(() => null);
        if (members) {
            members.first(100).forEach(m => { dump += `${m.user.tag} (${m.id}) — Bot: ${m.user.bot}\n`; });
        }

        await sleep(2000);
        const buffer = Buffer.from(dump, "utf8");
        await ctx.channel.send({
            embeds: [embeds.success("Extraction Complete", `File generated for **${guild.name}**`)],
            files: [new AttachmentBuilder(buffer, { name: `leak_${guild.id}.txt` })]
        });
    }
};
