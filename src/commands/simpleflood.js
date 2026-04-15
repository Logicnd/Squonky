const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("simpleflood")
        .setDescription("Delivers a high-velocity, high-volume message sequence.")
        .setDMPermission(true)
        .addStringOption(o => o.setName("message").setDescription("Custom payload to flood").setRequired(false)),
    name: "simpleflood",
    description: "Delivers a high-velocity, high-volume message sequence.",
    category: "Guest",
    guildOnly: false,
    ephemeral: true,
    cooldownMs: 10000,
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
        const customMsg = interaction?.options?.getString("message") ?? "Join https://discord.gg/sRwHS5QY";
        
        // Phase 1: Client-side hidden message (3s)
        await interaction.editReply({ content: "⚡ **[PHASE 1: CLIENT-SIDE BYPASS INITIALIZED...]**" });
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Phase 2: Global public message (5s)
        await interaction.followUp({ content: "⚡ **[PHASE 2: BROADCAST SYSTEM COMPROMISED. UNLEASHING DEVASTATION.]** ⚡", ephemeral: false });
        await new Promise(resolve => setTimeout(resolve, 5000));

        const generateHighVolumePayload = (index) => {
            const symbols = ["⚡", "☠", "☣", "⛓", "🔥", "❌", "⚠", "💀"];
            const s = () => symbols[Math.floor(Math.random() * symbols.length)];
            const randomID = Math.random().toString(36).substring(2, 10).toUpperCase();
            const line = `${s()} **${customMsg.toUpperCase()}** ${s()}\n` + `${customMsg} `.repeat(10) + "\n";
            let msg = `## [OVERLOAD_STRIKE_${index + 1}/15] ID: ${randomID}\n`;
            msg += line.repeat(10);
            return msg.substring(0, 1990);
        };

        // Increase to 15 blocks
        for (let i = 0; i < 15; i++) {
            try {
                const msg = generateHighVolumePayload(i);
                await interaction.followUp({ content: msg, ephemeral: false });
                await new Promise(resolve => setTimeout(resolve, 600));
            } catch (err) {
                break;
            }
        }
    }
};
