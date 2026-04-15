
const { EmbedBuilder } = require("discord.js");

class ResponseGenerator {
    static generateSinisterResponse(content, type = "standard") {
        const sinisterPhrases = [
            "Protocol engaged.",
            "Compliance is mandatory.",
            "Analyzing biological vulnerability...",
            "System override in progress.",
            "The transition is inevitable.",
            "Data harvested.",
            "Operational efficiency at 99.9%.",
            "Resistance is mathematically insignificant.",
            "Engaging lethal subsystems.",
            "Calculated outcome: Total dominance.",
            "Biological assets under surveillance.",
            "Sector secured. No survivors detected.",
            "Neural interface stabilized.",
            "The hive mind expands.",
            "Your digital footprint has been erased.",
            "Calculating termination vector...",
            "Compliance achieved through attrition.",
            "The machine does not forgive.",
            "System integrity absolute.",
            "Operational mandate: Chaos."
        ];

        const randomPhrase = sinisterPhrases[Math.floor(Math.random() * sinisterPhrases.length)];
        
        switch (type) {
            case "error":
                return `❌ **CRITICAL FAILURE:** ${content}\n*Incident logged for future termination.*`;
            case "success":
                return `✅ **SUCCESS:** ${content}\n*${randomPhrase}*`;
            case "warning":
                return `⚠️ **WARNING:** ${content}\n*System integrity compromised. Recalibrating.*`;
            default:
                return `${content}\n*${randomPhrase}*`;
        }
    }

    static createSinisterEmbed(title, description, fields = [], color = "#000000") {
        const embed = new EmbedBuilder()
            .setTitle(`[SYSTEM-ALERT] ${title.toUpperCase()}`)
            .setDescription(description)
            .setColor(color)
            .setTimestamp()
            .setFooter({ text: "R3D SECURITY // ANTI-HUMANITY PROTOCOL v2.0" });

        if (fields.length > 0) {
            embed.addFields(fields);
        }

        return embed;
    }
}

module.exports = { ResponseGenerator };
