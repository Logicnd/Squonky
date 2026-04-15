const fs = require("fs");
const path = require("path");
require("dotenv").config();

const DATA_PATH = path.join(__dirname, "..", "..", "data", "bot_config.json");

function readJsonSafe(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            return {};
        }
        const raw = fs.readFileSync(filePath, "utf8");
        return JSON.parse(raw);
    } catch (error) {
        return {};
    }
}

function parseCsv(value) {
    if (!value) return [];
    return String(value)
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);
}

function parseBool(value, fallback) {
    if (value === undefined || value === null || value === "") return fallback;
    const normalized = String(value).trim().toLowerCase();
    return ["1", "true", "yes", "y", "on"].includes(normalized);
}

function parseIntSafe(value, fallback) {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
}

const dataConfig = readJsonSafe(DATA_PATH);

const ownerIdsFromEnv = parseCsv(process.env.OWNER_IDS || process.env.OWNER_ID);

const defaultFeatures = {
    gaslighting: false,
    deepfake: false,
    socialEngineering: false,
    realityDistortion: false,
    behavioralControl: false,
    termination: false
};

const features = {
    gaslighting: parseBool(process.env.FEATURE_GASLIGHTING, defaultFeatures.gaslighting),
    deepfake: parseBool(process.env.FEATURE_DEEPFAKE, defaultFeatures.deepfake),
    socialEngineering: parseBool(process.env.FEATURE_SOCIAL_ENGINEERING, defaultFeatures.socialEngineering),
    realityDistortion: parseBool(process.env.FEATURE_REALITY_DISTORTION, defaultFeatures.realityDistortion),
    behavioralControl: parseBool(process.env.FEATURE_BEHAVIORAL_CONTROL, defaultFeatures.behavioralControl),
    termination: parseBool(process.env.FEATURE_TERMINATION, defaultFeatures.termination)
};

const envSafeMode = process.env.SAFE_MODE;
const safeMode = envSafeMode !== undefined && envSafeMode !== ""
    ? parseBool(envSafeMode, true)
    : (typeof dataConfig.safeMode === "boolean" ? dataConfig.safeMode : true);

const envMaxBroadcast = process.env.MAX_BROADCAST_CHANNELS;
const maxBroadcastChannels = Math.max(
    1,
    envMaxBroadcast !== undefined && envMaxBroadcast !== ""
        ? parseIntSafe(envMaxBroadcast, 3)
        : parseIntSafe(dataConfig.maxBroadcastChannels, 3)
);

const base = {
    cooldownMs: parseIntSafe(process.env.BOT_COOLDOWN_MS, 2000),
    maxBroadcastChannels,
    safeMode
};

const logWebhookEvents = parseCsv(process.env.LOG_WEBHOOK_EVENTS);

function cleanEnvValue(value) {
    if (!value) return "";
    return String(value).trim().replace(/^["']|["']$/g, "");
}

const config = {
    token: cleanEnvValue(process.env.BOT_TOKEN || process.env.DISCORD_TOKEN || dataConfig.token),
    prefix: cleanEnvValue(process.env.BOT_PREFIX || dataConfig.prefix || ">"),
    ownerIds: ownerIdsFromEnv.length ? ownerIdsFromEnv : (dataConfig.owners || []),
    cooldownMs: base.cooldownMs,
    maxBroadcastChannels: base.maxBroadcastChannels,
    allowedChannelIds: parseCsv(process.env.ALLOWED_CHANNELS),
    allowedGuildIds: parseCsv(process.env.ALLOWED_GUILDS),
    logChannelId: cleanEnvValue(process.env.LOG_CHANNEL_ID),
    logWebhookUrl: cleanEnvValue(process.env.LOG_WEBHOOK_URL),
    logWebhookEvents,
    enableMetrics: parseBool(process.env.ENABLE_METRICS, true),
    allowSensitiveCommands: parseBool(process.env.ALLOW_SENSITIVE_COMMANDS, true),
    safeMode: base.safeMode,
    activity: {
        name: cleanEnvValue(process.env.BOT_ACTIVITY) || "SYSTEM OVERRIDE",
        type: cleanEnvValue(process.env.BOT_ACTIVITY_TYPE) || "WATCHING"
    },
    features,
    osint: {
        dehashedApiKey: cleanEnvValue(process.env.DEHASHED_API_KEY),
        dehashedEmail: cleanEnvValue(process.env.DEHASHED_EMAIL),
        abstractApiKey: cleanEnvValue(process.env.ABSTRACT_API_KEY),
        intelxApiKey: cleanEnvValue(process.env.INTELX_API_KEY)
    },
    godMode: false,
    permanentlyTerminated: Boolean(dataConfig.permanentlyTerminated),
    dataPath: DATA_PATH,
    base
};

module.exports = config;
