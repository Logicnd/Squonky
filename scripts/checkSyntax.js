const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");

const includeRoots = [
    path.join(projectRoot, "src"),
    path.join(projectRoot, "api")
];

const includeFiles = [
    path.join(projectRoot, "server.js"),
    path.join(projectRoot, "web-server.js"),
    path.join(projectRoot, "app.js"),
    path.join(projectRoot, "bot.js")
];

function walkJsFiles(entryPath, out) {
    if (!fs.existsSync(entryPath)) return;

    const stats = fs.statSync(entryPath);
    if (stats.isFile() && entryPath.endsWith(".js")) {
        out.push(entryPath);
        return;
    }

    if (!stats.isDirectory()) return;

    for (const name of fs.readdirSync(entryPath)) {
        if (name === "node_modules" || name.startsWith(".")) continue;
        walkJsFiles(path.join(entryPath, name), out);
    }
}

function runSyntaxCheck(filePath) {
    const result = spawnSync(process.execPath, ["--check", filePath], {
        stdio: "pipe",
        encoding: "utf8"
    });

    return {
        ok: result.status === 0,
        stderr: result.stderr || "",
        stdout: result.stdout || ""
    };
}

const files = [];
includeRoots.forEach(root => walkJsFiles(root, files));
includeFiles.forEach(file => walkJsFiles(file, files));

const uniqueFiles = Array.from(new Set(files)).sort();
let failed = false;

for (const filePath of uniqueFiles) {
    const result = runSyntaxCheck(filePath);
    if (!result.ok) {
        failed = true;
        console.error(`\n[SYNTAX ERROR] ${path.relative(projectRoot, filePath)}`);
        if (result.stderr) console.error(result.stderr.trim());
        if (result.stdout) console.error(result.stdout.trim());
    }
}

if (failed) {
    process.exit(1);
}

console.log(`Syntax check passed for ${uniqueFiles.length} JS files.`);
