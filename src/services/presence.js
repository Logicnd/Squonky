const { ActivityType } = require("discord.js");

function resolveActivityType(value) {
    if (!value) return ActivityType.Playing;
    const normalized = String(value).trim().toLowerCase();
    const map = {
        playing: ActivityType.Playing,
        streaming: ActivityType.Streaming,
        listening: ActivityType.Listening,
        watching: ActivityType.Watching,
        competing: ActivityType.Competing
    };
    return map[normalized] ?? ActivityType.Playing;
}

function applyPresence(client, config) {
    if (!config.activity?.name) return;

    client.user.setActivity(config.activity.name, {
        type: resolveActivityType(config.activity.type)
    });
}

module.exports = {
    applyPresence
};
