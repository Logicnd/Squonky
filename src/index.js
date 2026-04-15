require("dotenv").config();
const { ProxyAgent, setGlobalDispatcher } = require("undici");

// --- PROXY BYPASS (ISP SSL FIX) ---
if (process.env.PROXY_URL) {
    const proxyAgent = new ProxyAgent(process.env.PROXY_URL);
    setGlobalDispatcher(proxyAgent);
}

const net = require("net");
const { Bot } = require("./core/Bot");
const logger = require("./utils/logger");

const LOCK_PORT = 12346;
const MAX_UNCAUGHT_EXCEPTIONS = 3;

const locker = net.createServer();
const bot = new Bot();

let shuttingDown = false;
let uncaughtExceptions = 0;

async function shutdown(exitCode = 0, reason = "Shutdown requested") {
    if (shuttingDown) return;
    shuttingDown = true;

    logger.warn(`Shutdown initiated: ${reason}`);

    try {
        await bot.stop();
    } catch (error) {
        logger.error("Failed to stop bot cleanly.", error);
    }

    try {
        if (locker.listening) {
            await new Promise(resolve => locker.close(() => resolve()));
        }
    } catch (error) {
        logger.error("Failed to release instance lock.", error);
    }

    process.exit(exitCode);
}

const { execSync } = require("child_process");

locker.once("error", (error) => {
    logger.error(`[DIAGNOSTIC] Port lock error received: code=${error.code}, port=${LOCK_PORT}`);
    if (error.code === "EADDRINUSE") {
        logger.error(`CRITICAL: Port ${LOCK_PORT} is already in use. Attempting to terminate zombie process...`);
        try {
            if (process.platform === "win32") {
                // Find PID using port
                const output = execSync(`netstat -ano | findstr :${LOCK_PORT}`).toString();
                const match = output.trim().split(/\s+/);
                const pid = match[match.length - 1];
                if (pid && !isNaN(pid)) {
                    execSync(`taskkill /F /PID ${pid}`);
                    logger.info(`Successfully terminated zombie process (PID: ${pid}). Restarting...`);
                    // Retry locking after kill
                    setTimeout(() => locker.listen(LOCK_PORT), 1000);
                    return;
                }
            } else {
                // Linux/macOS fallback
                const output = execSync(`lsof -t -i:${LOCK_PORT}`).toString().trim();
                if (output) {
                    execSync(`kill -9 ${output}`);
                    logger.info(`Successfully terminated zombie process (PID: ${output}). Restarting...`);
                    setTimeout(() => locker.listen(LOCK_PORT), 1000);
                    return;
                }
            }
        } catch (killError) {
            logger.error("Failed to terminate zombie process automatically. Manual intervention required.", killError);
        }
        process.exit(1);
    }

    logger.error("Lock sequence failure.", error);
    process.exit(1);
});

locker.once("listening", () => {
    logger.info("Operational lock acquired. System uniqueness guaranteed.");
});

locker.listen(LOCK_PORT);

process.on("SIGINT", () => {
    shutdown(0, "SIGINT");
});

process.on("SIGTERM", () => {
    shutdown(0, "SIGTERM");
});

process.on("unhandledRejection", (error) => {
    logger.error("SYSTEM ANOMALY: Unhandled Promise Rejection", error);
});

process.on("uncaughtException", (error) => {
    uncaughtExceptions += 1;
    logger.error("CRITICAL FAILURE: Uncaught Exception", error);

    if (uncaughtExceptions >= MAX_UNCAUGHT_EXCEPTIONS) {
        shutdown(1, `Exceeded uncaught exception threshold (${MAX_UNCAUGHT_EXCEPTIONS})`);
    }
});

(async () => {
    try {
        await bot.start();
    } catch (error) {
        logger.error("DEPLOYMENT FAILED. SYSTEM OFFLINE.", error);
        await shutdown(1, "Startup failure");
    }
})();
