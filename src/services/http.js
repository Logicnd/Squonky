const { ProxyAgent, setGlobalDispatcher } = require("undici");

const DEFAULT_TIMEOUT_MS = 8000;

// Apply proxy globally for all fetch requests if configured
const PROXY_URL = process.env.PROXY_URL;
if (PROXY_URL) {
    const proxyAgent = new ProxyAgent(PROXY_URL);
    setGlobalDispatcher(proxyAgent);
}

function withTimeout(ms) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    return { controller, timer };
}

async function fetchJson(url, options = {}) {
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const { controller, timer } = withTimeout(timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                "accept": "application/json",
                ...(options.headers || {})
            }
        });

        if (!response.ok) {
            const text = await response.text().catch(() => "");
            const error = new Error(`Request failed: ${response.status} ${response.statusText}`);
            error.status = response.status;
            error.body = text;
            throw error;
        }

        return await response.json();
    } finally {
        clearTimeout(timer);
    }
}

async function fetchText(url, options = {}) {
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const { controller, timer } = withTimeout(timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });

        if (!response.ok) {
            const text = await response.text().catch(() => "");
            const error = new Error(`Request failed: ${response.status} ${response.statusText}`);
            error.status = response.status;
            error.body = text;
            throw error;
        }

        return await response.text();
    } finally {
        clearTimeout(timer);
    }
}

module.exports = {
    fetchJson,
    fetchText
};
