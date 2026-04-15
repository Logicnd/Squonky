const fs = require("fs/promises");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "..", "data", "bot_config.json");

// ── Persistent config ──────────────────────────────────────────────────────
async function readState() {
    try {
        const raw = await fs.readFile(DATA_PATH, "utf8");
        return JSON.parse(raw);
    } catch (error) {
        if (error.code === "ENOENT") {
            return {
                token: "",
                prefix: ">",
                owners: [],
                safeMode: true,
                maxBroadcastChannels: 3,
                permanentlyTerminated: false
            };
        }
        throw error;
    }
}

async function writeState(state) {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify(state, null, 2));
    return state;
}

async function setTerminationFlag(enabled, meta) {
    const state = await readState();
    state.permanentlyTerminated = Boolean(enabled);
    if (enabled) {
        state.terminatedAt = new Date().toISOString();
        if (meta) state.terminatedBy = meta;
    } else {
        delete state.terminatedAt;
        delete state.terminatedBy;
    }
    return writeState(state);
}

async function setPrefix(prefix) {
    const state = await readState();
    state.prefix = prefix;
    return writeState(state);
}

async function setSafeMode(enabled) {
    const state = await readState();
    state.safeMode = Boolean(enabled);
    return writeState(state);
}

async function setMaxBroadcastChannels(value) {
    const state = await readState();
    state.maxBroadcastChannels = value;
    return writeState(state);
}

// ── Active intervals store (replaces global.* anti-pattern) ───────────────
const _intervals = new Map();

function storeInterval(key, id) {
    if (_intervals.has(key)) {
        clearInterval(_intervals.get(key));
    }
    _intervals.set(key, id);
}

function dropInterval(key) {
    if (_intervals.has(key)) {
        clearInterval(_intervals.get(key));
        _intervals.delete(key);
    }
}

function hasInterval(key) {
    return _intervals.has(key);
}

module.exports = {
    DATA_PATH,
    readState,
    writeState,
    setTerminationFlag,
    setPrefix,
    setSafeMode,
    setMaxBroadcastChannels,
    storeInterval,
    dropInterval,
    hasInterval
};
