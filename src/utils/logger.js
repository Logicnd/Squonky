const chalk = require("chalk");
const gradient = require("gradient-string");

const LEVELS = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40
};

const DEFAULT_LEVEL = "info";
const currentLevel = (process.env.LOG_LEVEL || DEFAULT_LEVEL).toLowerCase();
const threshold = LEVELS[currentLevel] ?? LEVELS[DEFAULT_LEVEL];

function formatMeta(meta) {
    if (!meta) return "";
    if (meta instanceof Error) return meta.stack || meta.message;
    if (typeof meta === "string") return meta;

    try {
        return JSON.stringify(meta, null, 2);
    } catch (error) {
        return String(meta);
    }
}

function log(level, message, meta) {
    if ((LEVELS[level] ?? 100) < threshold) return;

    const timestamp = new Date().toLocaleTimeString();
    
    switch (level) {
        case "debug":
            console.log(chalk.gray(`[${timestamp}] 🐛 ${message}`));
            break;
        case "info":
            // Check for specific keywords to apply gradients
            if (message.includes("Starting R3D")) {
                console.log(gradient.passion(`[${timestamp}] 🚀 ${message}`));
            } else if (message.includes("Successfully reloaded")) {
                console.log(gradient.cristal(`[${timestamp}] ✨ ${message}`));
            } else {
                console.log(chalk.blue(`[${timestamp}] ℹ️  ${message}`));
            }
            break;
        case "warn":
            console.warn(chalk.yellow(`[${timestamp}] ⚠️  ${message}`));
            break;
        case "error":
            console.error(chalk.red(`[${timestamp}] ❌ ${message}`));
            break;
        case "command":
            console.log(gradient.mind(`[${timestamp}] 🎮 ${message}`));
            break;
        default:
            console.log(`[${timestamp}] ${message}`);
    }

    const details = formatMeta(meta);
    if (details) {
        if (level === "error") {
            console.error(chalk.red(details));
        } else {
            console.log(chalk.gray(details));
        }
    }
}

function gradientLog(text, type = "passion") {
    console.log(gradient[type](text));
}

function action(actionName, target, executor) {
    log("info", `Action ${actionName} executed on ${target} by ${executor}`);
}

module.exports = {
    debug: (msg, meta) => log("debug", msg, meta),
    info: (msg, meta) => log("info", msg, meta),
    warn: (msg, meta) => log("warn", msg, meta),
    error: (msg, meta) => log("error", msg, meta),
    command: (msg, meta) => log("command", msg, meta),
    action,
    gradient: gradientLog,
    chalk
};
