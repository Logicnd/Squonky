const { EmbedBuilder } = require("discord.js");
const { selectBroadcastChannels } = require("../utils/discord");
const { sleep } = require("../utils/shared");

class SocialEngineeringModule {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
    }

    async execute(message, operationType) {
        const operations = {
            trust: async () => this.buildTrust(message),
            divide: async () => this.divideAndConquer(message),
            chaos: async () => this.createChaos(message),
            infiltrate: async () => this.infiltrateGroups(message)
        };

        const operation = operations[String(operationType || "").toLowerCase()];
        if (!operation) {
            return message.reply("Usage: >social [trust/divide/chaos/infiltrate]");
        }

        return operation();
    }

    async buildTrust(message) {
        const trustMessages = [
            "Appreciate everyone here. The community has good energy.",
            "Just a quick note: thanks for keeping things supportive.",
            "This server is a solid place to hang out.",
            "Shoutout to the folks who help keep chat welcoming.",
            "Good vibes today. Hope everyone is doing well."
        ];

        return this.broadcastWithEmbed(message, {
            title: "Trust Building Operation",
            description: "Operation: Community trust building",
            color: "#45B7D1",
            messages: trustMessages,
            action: "SOCIAL-TRUST"
        });
    }

    async divideAndConquer(message) {
        const divisionTopics = [
            "Some conversations feel tense today.",
            "It feels like opinions are getting sharper lately.",
            "The tone is a bit split in different channels.",
            "Feels like there are some strong disagreements today.",
            "There is a lot of debate energy right now."
        ];

        return this.broadcastWithEmbed(message, {
            title: "Divide and Conquer Operation",
            description: "Operation: Social division tactics",
            color: "#E74C3C",
            messages: divisionTopics,
            action: "SOCIAL-DIVIDE"
        });
    }

    async createChaos(message) {
        const chaosMessages = [
            "There are a lot of rumors going around. Stay sharp.",
            "Feels like something big is about to drop.",
            "The server feels a bit unpredictable right now.",
            "The timing of recent changes feels odd.",
            "Interesting energy in the chat today."
        ];

        return this.broadcastWithEmbed(message, {
            title: "Chaos Generation Operation",
            description: "Operation: Systematic confusion",
            color: "#9B59B6",
            messages: chaosMessages,
            action: "SOCIAL-CHAOS"
        });
    }

    async infiltrateGroups(message) {
        const infiltrationMessages = [
            "Hey everyone. Glad to be here.",
            "Nice to meet you all. Looking forward to chatting.",
            "This server seems chill. Thanks for having me.",
            "Jumping in to say hi. Hope everyone is doing well.",
            "Happy to join. Appreciate the welcome."
        ];

        return this.broadcastWithEmbed(message, {
            title: "Group Infiltration Operation",
            description: "Operation: Social integration",
            color: "#1ABC9C",
            messages: infiltrationMessages,
            action: "SOCIAL-INFILTRATE"
        });
    }

    async broadcastWithEmbed(message, options) {
        const channels = selectBroadcastChannels(message, this.config, this.config.maxBroadcastChannels);
        const skipCurrent = !this.config.safeMode;

        let count = 0;
        for (const channel of channels) {
            if (skipCurrent && channel.id === message.channel.id) continue;

            const payload = options.messages[Math.floor(Math.random() * options.messages.length)];
            try {
                await channel.send(payload);
                count += 1;
                await sleep(3000);
            } catch (error) {
                this.logger.warn(`Failed to send social message in ${channel.name}`, error);
            }
        }

        const embed = new EmbedBuilder()
            .setColor(options.color)
            .setTitle(options.title)
            .setDescription(
                `${options.description}\n` +
                `Channels: ${count}\n` +
                "Status: Active"
            )
            .setTimestamp();

        await message.reply({ embeds: [embed] });
        this.logger.action(options.action, "Community", message.author.tag);
        return true;
    }
}

module.exports = SocialEngineeringModule;
