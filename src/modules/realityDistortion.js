const { EmbedBuilder } = require("discord.js");
const { selectBroadcastChannels } = require("../utils/discord");
const { sleep } = require("../utils/shared");

class RealityDistortionModule {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
    }

    async execute(message, distortionType) {
        const distortions = {
            glitch: async () => this.glitchReality(message),
            matrix: async () => this.matrixEffect(message),
            mirror: async () => this.mirrorDimension(message)
        };

        const distortion = distortions[String(distortionType || "").toLowerCase()];
        if (!distortion) {
            return message.reply("Usage: >deceive [glitch/matrix/mirror]");
        }

        return distortion();
    }

    async glitchReality(message) {
        const glitchTexts = [
            "g l i t c h ... reality buffer unstable",
            "warning: reality checksum mismatch",
            "error 404: reality not found",
            "simulation drift detected - resyncing"
        ];

        const { count } = await this.broadcast(message, glitchTexts, 1000);

        const embed = new EmbedBuilder()
            .setColor("#00FF41")
            .setTitle("Reality Glitch Initiated")
            .setDescription(
                "Operation: Digital reality corruption\n" +
                `Channels: ${count}\n` +
                "Status: Active"
            )
            .addFields({
                name: "System Status",
                value: "ERROR: Reality buffer overflow detected",
                inline: false
            })
            .setTimestamp();

        await message.reply({ embeds: [embed] });
        this.logger.action("REALITY-GLITCH", "Digital Space", message.author.tag);
        return true;
    }

    async matrixEffect(message) {
        const matrixSequences = [
            "```\n01001000 01100101 01101100 01110000\n01001101 01100101\n```",
            "```\n> Accessing mainframe...\n> Reality.dll corrupted\n> Restoring from backup...\n> ERROR: Backup not found\n```",
            "```\nWake up.\nThe Matrix has you.\nFollow the white rabbit.\n```",
            "```\nYou take the blue pill...\nThe story ends.\nYou take the red pill...\nYou stay in Wonderland.\n```"
        ];

        const { count } = await this.broadcast(message, matrixSequences, 2000);

        const embed = new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle("Matrix Reality Breach")
            .setDescription(
                "Operation: Code reality injection\n" +
                `Channels: ${count}\n` +
                "Status: Active"
            )
            .addFields(
                { name: "Choice Protocol", value: "Red pill or blue pill?", inline: true },
                { name: "Reality Check", value: "Nothing is real", inline: true }
            )
            .setTimestamp();

        await message.reply({ embeds: [embed] });
        this.logger.action("REALITY-MATRIX", "Digital Space", message.author.tag);
        return true;
    }

    async mirrorDimension(message) {
        const mirrorMessages = [
            "Everything feels reversed today.",
            "Anyone else noticing the deja vu?",
            "Reality feels slightly off-balance.",
            "Like looking through a cracked mirror.",
            "Is it just me or does this feel flipped?"
        ];

        const { count } = await this.broadcast(message, mirrorMessages, 3000);

        const embed = new EmbedBuilder()
            .setColor("#C0392B")
            .setTitle("Mirror Dimension Activated")
            .setDescription(
                "Operation: Reflection reality shift\n" +
                `Channels: ${count}\n` +
                "Status: Active"
            )
            .addFields(
                { name: "Dimensional Status", value: "Reality/mirror boundary dissolved", inline: true },
                { name: "Effect Level", value: "Perception inversion active", inline: true }
            )
            .setTimestamp();

        await message.reply({ embeds: [embed] });
        this.logger.action("REALITY-MIRROR", "Digital Space", message.author.tag);
        return true;
    }

    async broadcast(message, messages, delayMs) {
        const channels = selectBroadcastChannels(message, this.config, this.config.maxBroadcastChannels);
        const skipCurrent = !this.config.safeMode;

        let count = 0;
        for (const channel of channels) {
            if (skipCurrent && channel.id === message.channel.id) continue;

            const payload = messages[Math.floor(Math.random() * messages.length)];
            try {
                await channel.send(payload);
                count += 1;
                await sleep(delayMs);
            } catch (error) {
                this.logger.warn(`Failed to send reality message in ${channel.name}`, error);
            }
        }

        return { count };
    }
}

module.exports = RealityDistortionModule;
