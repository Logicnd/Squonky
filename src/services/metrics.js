const metrics = {
    startedAt: new Date(),
    commands: {
        total: 0,
        byName: {},
        byGuild: {}
    },
    errors: {
        total: 0,
        byCommand: {}
    },
    cooldowns: {
        total: 0,
        byCommand: {}
    },
    api: {
        total: 0,
        failures: 0
    },
    voice: {
        totalDeployments: 0,
        byCommand: {},
        byGuild: {},
        byChannel: {},
        successfulConnections: 0,
        failedConnections: 0,
        totalDuration: 0,
        averageDuration: 0,
        multiChannelDeployments: 0,
        ttsMessages: 0,
        audioEffects: {
            ghostProtocol: 0,
            sonicWarfare: 0,
            voiceSuppression: 0,
            ttsWarnings: 0
        },
        activeConnections: new Set(),
        peakConnections: 0,
        uniqueUsersAffected: new Set()
    },
    lastCommand: null,
    lastError: null
};

function increment(map, key) {
    if (!map[key]) map[key] = 0;
    map[key] += 1;
}

function recordCommand(name, meta) {
    metrics.commands.total += 1;
    increment(metrics.commands.byName, name);
    if (meta && meta.guildId) {
        increment(metrics.commands.byGuild, meta.guildId);
    }
    metrics.lastCommand = {
        name,
        at: new Date().toISOString(),
        ...meta
    };
}

function recordCooldown(name) {
    metrics.cooldowns.total += 1;
    increment(metrics.cooldowns.byCommand, name);
}

function recordError(name, error) {
    metrics.errors.total += 1;
    increment(metrics.errors.byCommand, name || "unknown");
    metrics.lastError = {
        name: name || "unknown",
        message: error?.message || String(error),
        at: new Date().toISOString()
    };
}

function recordApiCall(success) {
    metrics.api.total += 1;
    if (!success) metrics.api.failures += 1;
}

function recordVoiceDeployment(commandName, guildId, channelId, duration, isMultiChannel = false, effectType = null) {
    metrics.voice.totalDeployments += 1;
    increment(metrics.voice.byCommand, commandName);

    if (guildId) {
        increment(metrics.voice.byGuild, guildId);
    }

    if (channelId) {
        increment(metrics.voice.byChannel, channelId);
    }

    metrics.voice.totalDuration += duration;
    metrics.voice.averageDuration = Math.floor(metrics.voice.totalDuration / metrics.voice.totalDeployments);

    if (isMultiChannel) {
        metrics.voice.multiChannelDeployments += 1;
    }

    if (effectType) {
        if (effectType.includes('ghost') || effectType.includes('protocol')) {
            metrics.voice.audioEffects.ghostProtocol += 1;
        } else if (effectType.includes('sonic') || effectType.includes('warfare')) {
            metrics.voice.audioEffects.sonicWarfare += 1;
        } else if (effectType.includes('suppression')) {
            metrics.voice.audioEffects.voiceSuppression += 1;
        } else if (effectType.includes('tts') || effectType.includes('warning')) {
            metrics.voice.audioEffects.ttsWarnings += 1;
        }
    }
}

function recordAudioEffect(type) {
    if (metrics.voice.audioEffects[type] !== undefined) {
        metrics.voice.audioEffects[type] += 1;
    }
}

function recordVoiceConnection(success, connectionId = null) {
    if (success) {
        metrics.voice.successfulConnections += 1;
        if (connectionId) {
            metrics.voice.activeConnections.add(connectionId);
            metrics.voice.peakConnections = Math.max(metrics.voice.peakConnections, metrics.voice.activeConnections.size);
        }
    } else {
        metrics.voice.failedConnections += 1;
    }
}

function recordVoiceDisconnection(connectionId) {
    if (connectionId) {
        metrics.voice.activeConnections.delete(connectionId);
    }
}

function recordTTSMessage(guildId, channelId, messageLength) {
    metrics.voice.ttsMessages += 1;
    if (guildId) {
        increment(metrics.voice.byGuild, guildId);
    }
    if (channelId) {
        increment(metrics.voice.byChannel, channelId);
    }
}

function recordVoiceUser(userId) {
    if (userId) {
        metrics.voice.uniqueUsersAffected.add(userId);
    }
}

function getVoiceMetrics() {
    return {
        totalDeployments: metrics.voice.totalDeployments,
        byCommand: { ...metrics.voice.byCommand },
        byGuild: { ...metrics.voice.byGuild },
        byChannel: { ...metrics.voice.byChannel },
        connectionStats: {
            successful: metrics.voice.successfulConnections,
            failed: metrics.voice.failedConnections,
            active: metrics.voice.activeConnections.size,
            peak: metrics.voice.peakConnections
        },
        durationStats: {
            total: metrics.voice.totalDuration,
            average: metrics.voice.averageDuration
        },
        multiChannelDeployments: metrics.voice.multiChannelDeployments,
        ttsMessages: metrics.voice.ttsMessages,
        audioEffects: { ...metrics.voice.audioEffects },
        uniqueUsersAffected: metrics.voice.uniqueUsersAffected.size,
        successRate: metrics.voice.totalDeployments > 0 ?
            ((metrics.voice.successfulConnections / (metrics.voice.successfulConnections + metrics.voice.failedConnections)) * 100).toFixed(2) : 0
    };
}

function snapshot() {
    return {
        ...metrics,
        voice: getVoiceMetrics(),
        uptimeSeconds: Math.floor(process.uptime())
    };
}

module.exports = {
    recordCommand,
    recordCooldown,
    recordError,
    recordApiCall,
    recordVoiceDeployment,
    recordAudioEffect,
    recordVoiceConnection,
    recordVoiceDisconnection,
    recordTTSMessage,
    recordVoiceUser,
    getVoiceMetrics,
    snapshot
};
