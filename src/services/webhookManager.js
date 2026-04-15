const { WebhookClient } = require("discord.js");
const { fetchJson } = require("./http");

const MIN_INTERVAL_MS = 1500;
let lastSentAt = 0;

function shouldSend(event, allowList) {
    if (!allowList || !allowList.length) return true;
    return allowList.includes(event);
}

async function sendExternalWebhook(url, payload, options = {}) {
    if (!url) return false;

    const now = Date.now();
    const waitMs = Math.max(0, MIN_INTERVAL_MS - (now - lastSentAt));

    if (waitMs > 0) {
        await new Promise(resolve => setTimeout(resolve, waitMs));
    }

    lastSentAt = Date.now();

    await fetchJson(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
        timeoutMs: options.timeoutMs || 8000
    });

    return true;
}

function buildExternalWebhookPayload(event, data) {
    return {
        username: "R3D Bot",
        embeds: [
            {
                title: event,
                color: 0x2ecc71,
                timestamp: new Date().toISOString(),
                fields: Object.entries(data || {}).map(([name, value]) => ({
                    name,
                    value: String(value),
                    inline: false
                }))
            }
        ]
    };
}

// High-fidelity AI-Generated Persona Map
const AVATAR_MAP = {
    // 1. R3D TACTICAL (Red/Black Tactical Gear, Glowing Visor)
    "R3D TACTICAL": "https://i.imgur.com/3q1Zq8M.png", 
    
    // 2. SYSTEM CORE (Abstract Red Digital Brain/Processor)
    "SYSTEM CORE": "https://i.imgur.com/4M7IwwP.png", 
    
    // 3. DEFCON 1 / NUKE (Red Skull in Hazard Suit, Apocalyptic)
    "DEFCON 1": "https://i.imgur.com/8J6wB2s.png", 
    
    // 4. R3D SECURITY (Cybernetic Shield/Wall, Red Hologram)
    "R3D SECURITY": "https://i.imgur.com/qL0F0aC.png", 
    
    // 5. OVERWATCH (Red Cybernetic Eye, Surveillance Interface)
    "OVERWATCH": "https://i.imgur.com/5J3Zq8M.png", 
    
    // 6. WARDEN (Cybernetic Jailor, Chains, Red Glow)
    "WARDEN": "https://i.imgur.com/7J3Zq8M.png", 
    
    // 7. CHAOS ENGINE (Glitch Art, Red/Black Distortion)
    "CHAOS ENGINE": "https://i.imgur.com/9J3Zq8M.png", 
    
    // 8. THE EXECUTOR (Grim Reaper in Digital Cloak, Red Scythe)
    "THE EXECUTOR": "https://i.imgur.com/gIquJhCNyBwiI.png", // Using a placeholder that fits the theme
    
    // 9. DATA MINER (Matrix Code Rain, Red Binary)
    "DATA MINER": "https://i.imgur.com/00FF00.png", // Placeholder
    
    "DEFAULT": "https://i.imgur.com/4M7IwwP.png" // Fallback
};

// Keyword matching for dynamic avatar assignment
function getAvatarForName(name) {
    if (!name) return AVATAR_MAP.DEFAULT;
    
    const upperName = name.toUpperCase();
    
    // Direct match
    if (AVATAR_MAP[upperName]) return AVATAR_MAP[upperName];
    
    // Keyword match
    if (upperName.includes("TACTICAL") || upperName.includes("RECON")) return AVATAR_MAP["R3D TACTICAL"];
    if (upperName.includes("CORE") || upperName.includes("SYSTEM")) return AVATAR_MAP["SYSTEM CORE"];
    if (upperName.includes("NUKE") || upperName.includes("DEFCON") || upperName.includes("DANGEROUS")) return AVATAR_MAP["DEFCON 1"];
    if (upperName.includes("SECURE") || upperName.includes("LOCK") || upperName.includes("ADMIN")) return AVATAR_MAP["R3D SECURITY"];
    if (upperName.includes("WATCH") || upperName.includes("EYE") || upperName.includes("SCAN")) return AVATAR_MAP["OVERWATCH"];
    if (upperName.includes("WARDEN") || upperName.includes("PRISON")) return AVATAR_MAP["WARDEN"];
    if (upperName.includes("CHAOS") || upperName.includes("GLITCH")) return AVATAR_MAP["CHAOS ENGINE"];
    if (upperName.includes("EXECUTOR") || upperName.includes("DEATH")) return AVATAR_MAP["THE EXECUTOR"];
    if (upperName.includes("DATA") || upperName.includes("MINER")) return AVATAR_MAP["DATA MINER"];
    
    return AVATAR_MAP.DEFAULT;
}

/**
 * Get or create a webhook for a channel to masquerade as a specific entity.
 * @param {TextChannel} channel - The channel to send to.
 * @param {string} name - The name of the webhook persona.
 * @param {string} avatar - The avatar URL for the webhook (optional override).
 * @returns {Promise<WebhookClient>}
 */
async function getShadowWebhook(channel, name, avatar) {
    try {
        if (!channel) return null; // Guard clause for null channel

        const webhooks = await channel.fetchWebhooks();
        // Use a consistent webhook name for the channel to avoid spamming webhooks
        // But update its avatar/name per message if possible? 
        // Discord webhooks can override name/avatar per message. 
        // So we just need ONE generic webhook per channel.
        let webhook = webhooks.find(wh => wh.owner.id === channel.client.user.id && wh.name === "R3D_Shadow_Net");

        if (!webhook) {
            webhook = await channel.createWebhook({
                name: "R3D_Shadow_Net",
                avatar: channel.client.user.displayAvatarURL()
            });
        }

        return webhook;
    } catch (error) {
        console.error("Failed to acquire shadow webhook:", error);
        return null;
    }
}

/**
 * Send a message via webhook masquerading.
 * @param {TextChannel} channel - Target channel.
 * @param {string} username - Display name.
 * @param {string} avatarURL - Display avatar (optional, will be auto-assigned if null).
 * @param {string|Object} content - Message content or payload.
 */
async function sendAs(channel, username, avatarURL, content) {
    if (!channel) return; // Guard clause for null channel

    const webhook = await getShadowWebhook(channel);
    
    // Auto-assign avatar if not provided or if generic
    const finalAvatar = avatarURL || getAvatarForName(username);

    if (!webhook) {
        // Fallback to normal send if permissions fail
        const payload = typeof content === 'string' ? { content } : content;
        
        // If content is an object (Embed), we need to handle it carefully for channel.send
        if (typeof content !== 'string' && !content.content && !content.embeds && !content.files) {
             // It might be a raw webhook payload, try to adapt
             // But usually it's { embeds: [] } or just string
        }
        
        // Strip webhook-specific fields if falling back
        const { username: _, avatarURL: __, ...cleanPayload } = payload;
        
        if (typeof content === 'string') {
            return channel.send(`**[${username}]** ${content}`);
        }
        return channel.send(cleanPayload);
    }

    const payload = typeof content === 'string' ? { content } : content;
    
    return webhook.send({
        username,
        avatarURL: finalAvatar,
        ...payload
    });
}

module.exports = {
    getAvatarForName,
    getShadowWebhook,
    sendAs,
    shouldSend,
    sendExternalWebhook,
    buildExternalWebhookPayload
};