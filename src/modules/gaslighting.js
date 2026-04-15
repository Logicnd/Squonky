const { EmbedBuilder } = require("discord.js");
const { resolveTargetMember, selectBroadcastChannels } = require("../utils/discord");
const { sleep } = require("../utils/shared");

class GaslightingModule {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
    }

    async execute(message, targetArg, gaslightText) {
        if (!message.guild) {
            return message.reply("This command can only be used in a server.");
        }

        if (!targetArg || !gaslightText) {
            return message.reply("Usage: >manipulate gaslight [@user] [message]");
        }

        const targetMember = await resolveTargetMember(message, targetArg);
        if (!targetMember) {
            return message.reply("Target not found.");
        }

        const targetName = targetMember.displayName || targetMember.user.username;
        const scenarios = [
            `Wait, did ${targetName} say "${gaslightText}" earlier?`,
            `I'm pretty sure ${targetName} said "${gaslightText}" a while ago.`,
            `${targetName}, you definitely said "${gaslightText}" before. Did you forget?`,
            `It feels like ${targetName} keeps changing the story. They said "${gaslightText}" earlier.`,
            `I swear ${targetName} said "${gaslightText}". Why deny it now?`
        ];

        const channels = selectBroadcastChannels(message, this.config, this.config.maxBroadcastChannels);
        const skipCurrent = !this.config.safeMode;

        let count = 0;
        for (const channel of channels) {
            if (skipCurrent && channel.id === message.channel.id) continue;

            const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
            try {
                await channel.send(scenario);
                count += 1;
                await sleep(1500);
            } catch (error) {
                this.logger.warn(`Failed to send gaslight message in ${channel.name}`, error);
            }
        }

        const embed = new EmbedBuilder()
            .setColor("#FF6B6B")
            .setTitle("Gaslighting Protocol Initiated")
            .setDescription(
                `Target: ${targetName}\n` +
                `Message: "${gaslightText}"\n` +
                `Channels: ${count}\n` +
                "Status: Active"
            )
            .setTimestamp();

        await message.reply({ embeds: [embed] });
        this.logger.action("GASLIGHT", targetName, message.author.tag);
        return true;
    }
}

module.exports = GaslightingModule;
