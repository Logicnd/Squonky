const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("simplenuke")
        .setDescription("Unleashes a rapid-fire, high-volume plain-text sequence.")
        .setDMPermission(true)
        .addStringOption(o => o.setName("message").setDescription("Payload for the nuke").setRequired(false)),
    name: "simplenuke",
    description: "Rapid-fire 100-message nuke (Anonymous).",
    category: "Guest",
    guildOnly: false,
    ephemeral: true,
    cooldownMs: 30000,
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
        const payload = interaction?.options?.getString("message") ?? "☣️ SYSTEM OVERRIDE ☣️ NUCLEAR PROTOCOL ☣️";
        
        // Phase 1: Stealth Init (Ephemeral)
        await interaction.editReply({ content: "**[PHASE 1: CLIENT-SIDE INITIALIZATION... SECURING UPLINK]**" });
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Phase 2: Public Announcement
        await interaction.followUp({ content: "☣️ **[PHASE 2: GLOBAL SECTOR OVERRIDE INITIATED. UNLEASHING NUCLEAR PAYLOAD.]** ☣️", ephemeral: false });
        await new Promise(resolve => setTimeout(resolve, 5000));

        const count = 25; // Adjusted for massive block stability
        const delay = 800;

        const generateMassivePayload = (i) => {
            const symbols = ["⛧", "☠", "☣", "⚡", "⛓", "💣", "🔥", "❌", "⚠", "💀", "👹", "🔪", "💉", "⚰", "🩸"];
            const s = () => symbols[Math.floor(Math.random() * symbols.length)];
            const randomID = Math.random().toString(36).substring(2, 10).toUpperCase();
            
            // Build a massive 2000-char block of pure spam
            let msg = `## ${s()}${s()} [NUCLEAR_STRIKE_${i + 1}/${count}] ${s()}${s()}\n`;
            msg += `**PAYLOAD:** ${payload.toUpperCase()}\n`;
            msg += `> **SYSTEM_ERROR:** \`${randomID}\` **STABILITY:** \`0%\`\n`;
            msg += `\`${payload}\` `.repeat(150); // Massive filler
            return msg.substring(0, 1995);
        };

        for (let i = 0; i < count; i++) {
            try {
                const msg = generateMassivePayload(i);
                await interaction.followUp({ content: msg, ephemeral: false });
                await new Promise(resolve => setTimeout(resolve, delay));
            } catch (err) {
                if (err.code === 40094) break; 
                break;
            }
        }
    }
};
