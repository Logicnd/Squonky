const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../utils/embeds");
const { requireDangerousAuth } = require("../utils/dangerousAuth");
const { sleep } = require("../utils/shared");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("network")
        .setDescription("Simulate a network infrastructure attack.")
        .setDMPermission(false)
        .addStringOption(o =>
            o.setName("mode").setDescription("Attack mode").setRequired(false)
                .addChoices(
                    { name: "DDoS", value: "ddos" },
                    { name: "MITM", value: "mitm" },
                    { name: "Packet Injection", value: "inject" }
                )),
    name: "network",
    description: "Simulate a network attack.",
    category: "Dangerous",
    ownerOnly: true,
    async execute({ ctx, interaction, config }) {
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
        const mode = interaction?.options?.getString("mode") ?? ctx.args?.[0] ?? "ddos";

        const modes = {
            ddos: { label: "DDoS Attack", steps: ["Establishing botnet connection...", "Flooding target with packets...", "Rate limit exceeded — node overloaded.", "Attack sustained. Target degraded."] },
            mitm: { label: "Man-in-the-Middle", steps: ["Intercepting network traffic...", "Forging SSL certificates...", "Session hijack in progress...", "Traffic rerouting complete."] },
            inject: { label: "Packet Injection", steps: ["Scanning network topology...", "Crafting malicious payload...", "Injecting into data stream...", "Payload delivered. Response captured."] }
        };

        const attack = modes[mode] ?? modes.ddos;

        await requireDangerousAuth(ctx, "network", async () => {
            const lines = [];
            let msg = null;
            for (const step of attack.steps) {
                lines.push(`> ${step}`);
                const e = embeds.danger(attack.label).setDescription("```\n" + lines.join("\n") + "\n```");
                if (!msg) msg = await ctx.channel.send({ embeds: [e] }).catch(() => null);
                else await msg.edit({ embeds: [e] }).catch(() => {});
                await sleep(1000);
            }
        }, config);
    }
};
