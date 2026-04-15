const { EmbedBuilder } = require("discord.js");
const { resolveTargetMember, selectBroadcastChannels } = require("../utils/discord");
const { sleep } = require("../utils/shared");

class DeepfakeModule {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
    }

    async execute(message, targetArg, personalityType) {
        if (!message.guild) {
            return message.reply("This command can only be used in a server.");
        }

        if (!targetArg || !personalityType) {
            return message.reply(
                "Usage: >manipulate deepfake [@user] [aggressive/submissive/paranoid/confident/unstable]"
            );
        }

        const targetMember = await resolveTargetMember(message, targetArg);
        if (!targetMember) {
            return message.reply("Target not found.");
        }

        const personalities = {
            aggressive: {
                traits: ["Starting arguments", "Hostile tone", "Constantly angry"],
                behaviors: ["Threatens others", "Uses excessive caps", "Attacks people personally"],
                scenarios: [
                    "Has anyone noticed the aggressive tone lately?",
                    "It feels like tempers are flaring more than usual.",
                    "Is it just me or has the vibe been more hostile?"
                ]
            },
            submissive: {
                traits: ["Overly apologetic", "Avoids conflict", "Seeks validation"],
                behaviors: ["Apologizes constantly", "Second-guesses themselves", "Asks for reassurance"],
                scenarios: [
                    "Seems like someone is apologizing for everything today.",
                    "There is a lot of self-doubt in the chat lately.",
                    "Feels like people are looking for constant reassurance."
                ]
            },
            paranoid: {
                traits: ["Distrustful", "Suspicious", "Overthinks"],
                behaviors: ["Accuses others", "Screenshots everything", "Worries about intent"],
                scenarios: [
                    "Feels like trust is lower in the server right now.",
                    "Some conversations feel overly guarded today.",
                    "People seem to be reading too much into everything."
                ]
            },
            confident: {
                traits: ["Overconfident", "Brags often", "Acts superior"],
                behaviors: ["Shows off achievements", "Talks over others", "Acts dismissive"],
                scenarios: [
                    "Is it just me or are people bragging a lot lately?",
                    "The confidence levels are sky high today.",
                    "Some comments feel a bit too self-important."
                ]
            },
            unstable: {
                traits: ["Mood swings", "Unpredictable", "Emotional volatility"],
                behaviors: ["Random outbursts", "Contradictions", "Erratic messages"],
                scenarios: [
                    "The tone keeps changing every few minutes.",
                    "Things feel unpredictable in chat right now.",
                    "The energy is all over the place today."
                ]
            }
        };

        const personality = personalities[personalityType.toLowerCase()];
        if (!personality) {
            return message.reply(
                "Invalid personality type. Use: aggressive, submissive, paranoid, confident, unstable"
            );
        }

        const channels = selectBroadcastChannels(message, this.config, this.config.maxBroadcastChannels);
        const skipCurrent = !this.config.safeMode;

        let count = 0;
        for (const channel of channels) {
            if (skipCurrent && channel.id === message.channel.id) continue;

            const scenario = personality.scenarios[Math.floor(Math.random() * personality.scenarios.length)];
            try {
                await channel.send(scenario);
                count += 1;
                await sleep(2000);
            } catch (error) {
                this.logger.warn(`Failed to send deepfake message in ${channel.name}`, error);
            }
        }

        const embed = new EmbedBuilder()
            .setColor("#4ECDC4")
            .setTitle("Deepfake Personality Projection")
            .setDescription(
                `Target: ${targetMember.displayName}\n` +
                `Personality: ${personalityType.toUpperCase()}\n` +
                `Traits: ${personality.traits.join(", ")}\n` +
                `Channels: ${count}\n` +
                "Status: Active"
            )
            .addFields({
                name: "Behavioral Patterns",
                value: personality.behaviors.join("\n"),
                inline: true
            })
            .setTimestamp();

        await message.reply({ embeds: [embed] });
        this.logger.action("DEEPFAKE", targetMember.displayName, message.author.tag);
        return true;
    }
}

module.exports = DeepfakeModule;
