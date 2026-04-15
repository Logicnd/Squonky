#!/usr/bin/env node

/**
 * Backup script for R3D
 * Creates backups of configuration and data files.
 */

const fs = require("fs").promises;
const path = require("path");

async function createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupDir = path.join(__dirname, "..", "data", "backups", timestamp);

    try {
        await fs.mkdir(backupDir, { recursive: true });

        const filesToBackup = [
            "data/bot_config.json",
            "package.json",
            ".env"
        ];

        console.log(`Creating backup: ${timestamp}`);

        for (const file of filesToBackup) {
            const sourcePath = path.join(__dirname, "..", file);
            const destPath = path.join(backupDir, path.basename(file));

            try {
                await fs.copyFile(sourcePath, destPath);
                console.log(`Backed up: ${file}`);
            } catch (error) {
                if (error.code === "ENOENT") {
                    console.log(`Skipped: ${file} (not found)`);
                } else {
                    console.error(`Failed to backup ${file}:`, error.message);
                }
            }
        }

        const backupInfo = {
            timestamp: new Date().toISOString(),
            version: require("../package.json").version,
            files: filesToBackup,
            description: "Automated backup of R3D configuration"
        };

        await fs.writeFile(
            path.join(backupDir, "backup-info.json"),
            JSON.stringify(backupInfo, null, 2)
        );

        console.log("Backup completed successfully.");
        console.log(`Location: ${backupDir}`);

        await cleanupOldBackups();
    } catch (error) {
        console.error("Backup failed:", error.message);
        process.exit(1);
    }
}

async function cleanupOldBackups() {
    try {
        const backupsDir = path.join(__dirname, "..", "data", "backups");
        const entries = await fs.readdir(backupsDir);

        const backups = entries.filter(entry => entry.match(/^\\d{4}-\\d{2}-\\d{2}T/));
        backups.sort().reverse();

        const toDelete = backups.slice(10);
        for (const backup of toDelete) {
            const backupPath = path.join(backupsDir, backup);
            await fs.rm(backupPath, { recursive: true, force: true });
            console.log(`Removed old backup: ${backup}`);
        }
    } catch (error) {
        console.log("Could not cleanup old backups:", error.message);
    }
}

if (require.main === module) {
    createBackup();
}

module.exports = { createBackup, cleanupOldBackups };
