const cooldowns = new Map();

function checkCooldown(userId, commandName, cooldownMs) {
    const now = Date.now();

    if (!cooldowns.has(userId)) {
        cooldowns.set(userId, new Map());
    }

    const userCooldowns = cooldowns.get(userId);
    if (userCooldowns.has(commandName)) {
        const expirationTime = userCooldowns.get(commandName) + cooldownMs;
        if (now < expirationTime) {
            return Math.ceil((expirationTime - now) / 1000);
        }
    }

    userCooldowns.set(commandName, now);
    return 0;
}

function clearCooldown(userId, commandName) {
    if (!cooldowns.has(userId)) return false;
    const userCooldowns = cooldowns.get(userId);
    const result = userCooldowns.delete(commandName);
    if (userCooldowns.size === 0) {
        cooldowns.delete(userId);
    }
    return result;
}

module.exports = {
    cooldowns,
    checkCooldown,
    clearCooldown
};
