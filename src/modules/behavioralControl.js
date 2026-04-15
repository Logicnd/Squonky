const { EmbedBuilder } = require("discord.js");
const { resolveTargetMember, selectBroadcastChannels } = require("../utils/discord");
const { sleep } = require("../utils/shared");

class BehavioralControlModule {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
    }

    async execute(message, controlMethod, targetArg) {
        const methods = {
            puppet: async () => this.puppetControl(message, targetArg),
            influence: async () => this.influenceControl(message, targetArg),
            suggestion: async () => this.suggestionControl(message, targetArg)
        };

        const method = methods[String(controlMethod || "").toLowerCase()];
        if (!method) {
            return message.reply("Usage: >control [puppet/influence/suggestion] [@user]");
        }

        return method();
    }

    async puppetControl(message, targetArg) {
        if (!targetArg) {
            return message.reply("Usage: >control puppet [@user]");
        }

        const targetMember = await resolveTargetMember(message, targetArg);
        if (!targetMember) {
            return message.reply("Target not found.");
        }

        const targetName = targetMember.displayName || targetMember.user.username;
        const puppetCommands = [
            `${targetName}, can you clarify your last point?`,
            `${targetName}, could you share more context for that?`,
            `It might help if ${targetName} expands on that idea.`,
            `${targetName}, can you explain what you mean?`,
            `Anyone else want ${targetName} to elaborate?`
        ];

        const { count } = await this.broadcast(message, puppetCommands, 2500);

        const embed = new EmbedBuilder()
            .setColor("#8E44AD")
            .setTitle("Puppet Control Activated")
            .setDescription(
                `Target: ${targetName}\n` +
                "Method: Direct social prompting\n" +
                `Channels: ${count}\n` +
                "Status: Active"
            )
            .addFields(
                { name: "Control Level", value: "High - direct prompts", inline: true },
                { name: "Response Expected", value: "Immediate", inline: true }
            )
            .setTimestamp();

        await message.reply({ embeds: [embed] });
        this.logger.action("CONTROL-PUPPET", targetName, message.author.tag);
        return true;
    }

    async influenceControl(message, targetArg) {
        if (!targetArg) {
            return message.reply("Usage: >control influence [@user]");
        }

        const targetMember = await resolveTargetMember(message, targetArg);
        if (!targetMember) {
            return message.reply("Target not found.");
        }

        const targetName = targetMember.displayName || targetMember.user.username;
        const influenceMessages = [
            `${targetName} has been quiet lately. Everything good?`,
            `Checking in on ${targetName}. Hope all is well.`,
            `${targetName}, we appreciate your input here.`,
            `It would be great to hear from ${targetName} on this.`,
            `${targetName}, you are welcome to share your thoughts.`
        ];

        const { count } = await this.broadcast(message, influenceMessages, 3000);

        const embed = new EmbedBuilder()
            .setColor("#E67E22")
            .setTitle("Influence Control Deployed")
            .setDescription(
                `Target: ${targetName}\n` +
                "Method: Subtle social influence\n" +
                `Channels: ${count}\n` +
                "Status: Active"
            )
            .addFields(
                { name: "Influence Type", value: "Supportive prompting", inline: true },
                { name: "Pressure Level", value: "Medium", inline: true }
            )
            .setTimestamp();

        await message.reply({ embeds: [embed] });
        this.logger.action("CONTROL-INFLUENCE", targetName, message.author.tag);
        return true;
    }

    async suggestionControl(message, targetArg) {
        if (!targetArg) {
            return message.reply("Usage: >control suggestion [@user]");
        }

        const targetMember = await resolveTargetMember(message, targetArg);
        if (!targetMember) {
            return message.reply("Target not found.");
        }

        const targetName = targetMember.displayName || targetMember.user.username;
        const suggestions = [
            `${targetName}, maybe take a short break and come back refreshed.`,
            `${targetName}, it could help to step back and reset for a moment.`,
            `${targetName}, want to revisit this after a pause?`,
            `${targetName}, maybe we can slow things down for clarity.`,
            `${targetName}, taking a breath can help with perspective.`
        ];

        const { count } = await this.broadcast(message, suggestions, 4000);

        const embed = new EmbedBuilder()
            .setColor("#27AE60")
            .setTitle("Suggestion Control Implanted")
            .setDescription(
                `Target: ${targetName}\n` +
                "Method: Gentle suggestion\n" +
                `Channels: ${count}\n` +
                "Status: Active"
            )
            .addFields(
                { name: "Suggestion Type", value: "Behavioral cues", inline: true },
                { name: "Implementation", value: "Gradual", inline: true }
            )
            .setTimestamp();

        await message.reply({ embeds: [embed] });
        this.logger.action("CONTROL-SUGGESTION", targetName, message.author.tag);
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
                this.logger.warn(`Failed to send control message in ${channel.name}`, error);
            }
        }

        return { count };
    }
}

module.exports = BehavioralControlModule;
