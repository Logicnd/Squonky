const { cooldowns, checkCooldown, clearCooldown } = require("./cooldowns");

// Voice command specific cooldowns (in milliseconds)
const VOICE_COOLDOWNS = {
    // Basic voice commands
    sonicwarfare: 30000,      // 30 seconds
    ttswarning: 45000,        // 45 seconds
    voicebomb: 60000,         // 1 minute
    voicephishing: 30000,     // 30 seconds
    voicesiege: 120000,       // 2 minutes
    soundboardhijack: 45000,  // 45 seconds
    
    // Advanced voice commands
    ghostprotocol: 90000,     // 1.5 minutes
    
    // Global voice warfare cooldown (prevents spam across all voice commands)
    GLOBAL_VOICE: 15000       // 15 seconds between any voice commands
};

// Track voice command usage across guilds
const guildVoiceUsage = new Map();

/**
 * Check if a user is on cooldown for a specific voice command
 * @param {string} userId - Discord user ID
 * @param {string} commandName - Command name
 * @param {string} guildId - Guild ID for guild-wide cooldowns
 * @returns {Object} Cooldown status { onCooldown: boolean, remainingTime: number, reason: string }
 */
function checkVoiceCooldown(userId, commandName, guildId = null) {
    const now = Date.now();
    
    // Check global voice cooldown
    const globalCooldown = VOICE_COOLDOWNS.GLOBAL_VOICE;
    const globalRemaining = checkCooldown(userId, "GLOBAL_VOICE", globalCooldown);
    
    if (globalRemaining > 0) {
        return {
            onCooldown: true,
            remainingTime: globalRemaining,
            reason: `Global voice command cooldown (${globalRemaining}s remaining)`
        };
    }
    
    // Check specific command cooldown
    const commandCooldown = VOICE_COOLDOWNS[commandName] || 30000; // Default 30s
    const commandRemaining = checkCooldown(userId, commandName, commandCooldown);
    
    if (commandRemaining > 0) {
        return {
            onCooldown: true,
            remainingTime: commandRemaining,
            reason: `${commandName} cooldown (${commandRemaining}s remaining)`
        };
    }
    
    // Check guild-wide voice spam protection
    if (guildId) {
        if (!guildVoiceUsage.has(guildId)) {
            guildVoiceUsage.set(guildId, new Map());
        }
        
        const guildUsage = guildVoiceUsage.get(guildId);
        const recentUsage = guildUsage.get(userId);
        
        if (recentUsage && now - recentUsage < 10000) { // 10 second guild spam protection
            return {
                onCooldown: true,
                remainingTime: Math.ceil((10000 - (now - recentUsage)) / 1000),
                reason: "Guild voice spam protection"
            };
        }
        
        guildUsage.set(userId, now);
    }
    
    return {
        onCooldown: false,
        remainingTime: 0,
        reason: ""
    };
}

/**
 * Apply voice command cooldowns (both global and specific)
 * @param {string} userId - Discord user ID
 * @param {string} commandName - Command name
 */
function applyVoiceCooldown(userId, commandName) {
    const now = Date.now();
    
    // Apply global voice cooldown
    const globalCooldown = VOICE_COOLDOWNS.GLOBAL_VOICE;
    if (!cooldowns.has(userId)) {
        cooldowns.set(userId, new Map());
    }
    cooldowns.get(userId).set("GLOBAL_VOICE", now);
    
    // Apply specific command cooldown
    const commandCooldown = VOICE_COOLDOWNS[commandName] || 30000;
    cooldowns.get(userId).set(commandName, now);
}

/**
 * Clear voice command cooldowns
 * @param {string} userId - Discord user ID
 * @param {string} commandName - Command name (optional, clears all if not specified)
 */
function clearVoiceCooldown(userId, commandName = null) {
    if (commandName) {
        // Clear specific command cooldown
        clearCooldown(userId, commandName);
        return true;
    } else {
        // Clear all voice-related cooldowns for user
        const voiceCommands = Object.keys(VOICE_COOLDOWNS);
        let cleared = false;
        
        for (const cmd of voiceCommands) {
            if (clearCooldown(userId, cmd)) {
                cleared = true;
            }
        }
        
        return cleared;
    }
}

/**
 * Get voice cooldown status for a user
 * @param {string} userId - Discord user ID
 * @returns {Object} All active cooldowns for the user
 */
function getVoiceCooldownStatus(userId) {
    const userCooldowns = cooldowns.get(userId);
    if (!userCooldowns) {
        return {};
    }
    
    const now = Date.now();
    const status = {};
    
    for (const [command, timestamp] of userCooldowns.entries()) {
        if (command.includes("voice") || command === "GLOBAL_VOICE" || VOICE_COOLDOWNS[command]) {
            const cooldown = VOICE_COOLDOWNS[command] || 30000;
            const remaining = Math.ceil((timestamp + cooldown - now) / 1000);
            
            if (remaining > 0) {
                status[command] = {
                    remainingTime: remaining,
                    totalCooldown: cooldown / 1000
                };
            }
        }
    }
    
    return status;
}

/**
 * Clean up expired cooldowns (for memory management)
 */
function cleanupVoiceCooldowns() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [userId, userCooldowns] of cooldowns.entries()) {
        for (const [command, timestamp] of userCooldowns.entries()) {
            if (command.includes("voice") || command === "GLOBAL_VOICE" || VOICE_COOLDOWNS[command]) {
                const cooldown = VOICE_COOLDOWNS[command] || 30000;
                if (now - timestamp > cooldown) {
                    userCooldowns.delete(command);
                    cleaned++;
                }
            }
        }
        
        if (userCooldowns.size === 0) {
            cooldowns.delete(userId);
        }
    }
    
    // Clean up guild usage tracking
    for (const guildUsage of guildVoiceUsage.values()) {
        const now = Date.now();
        for (const [userId, lastUse] of guildUsage.entries()) {
            if (now - lastUse > 30000) { // 30 second cleanup
                guildUsage.delete(userId);
            }
        }
    }
    
    return cleaned;
}

// Auto-cleanup every 5 minutes
setInterval(cleanupVoiceCooldowns, 5 * 60 * 1000);

module.exports = {
    VOICE_COOLDOWNS,
    checkVoiceCooldown,
    applyVoiceCooldown,
    clearVoiceCooldown,
    getVoiceCooldownStatus,
    cleanupVoiceCooldowns
};