const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");
const { requireDangerousAuth } = require("../utils/dangerousAuth");
const { sleep } = require("../utils/shared");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("database")
        .setDescription("Simulate a database breach — posts fake exfiltrated records.")
        .setDMPermission(false),
    name: "database",
    description: "Simulate a database breach.",
    category: "Dangerous",
    ownerOnly: true,
    guildOnly: true,
    async execute({ ctx, guild, config }) {
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
        await requireDangerousAuth(ctx, "database", async () => {
            const fakeRecords = [
                { table: "users", records: guild.members.cache.size, sample: "id, username, email, password_hash, created_at" },
                { table: "messages", records: Math.floor(Math.random() * 100000), sample: "id, user_id, channel_id, content, timestamp" },
                { table: "tokens", records: Math.floor(Math.random() * 500), sample: "id, user_id, token, expires_at" },
                { table: "sessions", records: Math.floor(Math.random() * 2000), sample: "id, user_id, ip_address, last_seen" }
            ];

            await ctx.channel.send({ embeds: [embeds.danger("Database Breach Initiated", "Extracting records...`")] });

            for (const rec of fakeRecords) {
                await sleep(800);
                await ctx.channel.send({ embeds: [
                    embeds.danger(`Table: ${rec.table}`, null, [
                        { name: "Records Extracted", value: `${rec.records.toLocaleString()}`, inline: true },
                        { name: "Schema", value: `\`${rec.sample}\``, inline: false }
                    ])
                ] });
            }

            await ctx.channel.send({ embeds: [embeds.success("Extraction Complete", `**${fakeRecords.length}** tables exfiltrated.`)] });
        }, config);
    }
};
