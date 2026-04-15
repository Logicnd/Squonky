
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { buildExternalWebhookPayload, sendExternalWebhook, shouldSend } = require("./webhookManager");

async function emitAudit(event, config, data) {
    if (!config.logWebhookUrl) return false;
    if (!shouldSend(event, config.logWebhookEvents)) return false;

    const payload = buildExternalWebhookPayload(event, data);
    await sendExternalWebhook(config.logWebhookUrl, payload, { timeoutMs: 8000 });
    return true;
}

class AuditLogger {
    constructor(client, config) {
        this.client = client;
        this.config = config;
        this.logDir = path.join(__dirname, "..", "..", "logs");
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    async logAction(type, data) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            type,
            ...data
        };

        // File logging
        const fileName = `${new Date().toISOString().split('T')[0]}.log`;
        const filePath = path.join(this.logDir, fileName);
        try {
            fs.appendFileSync(filePath, JSON.stringify(logEntry) + "\n");
        } catch (error) {
            console.error("AuditLogger: Failed to append file log", error);
        }

        // Discord logging if channel is configured
        if (this.config.logChannelId) {
            try {
                const channel = await this.client.channels.fetch(this.config.logChannelId);
                if (channel) {
                    const embed = new EmbedBuilder()
                        .setTitle(`[AUDIT] ${type.toUpperCase()}`)
                        .setColor(type.includes("ERROR") ? "#FF0000" : "#0000FF")
                        .setTimestamp()
                        .setDescription(`\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``);
                    
                    await channel.send({ embeds: [embed] });
                }
            } catch (error) {
                console.error("AuditLogger: Failed to send Discord log", error);
            }
        }
    }
}

module.exports = { AuditLogger, emitAudit };
