const { EmbedBuilder } = require("discord.js");

const FOOTER = "R3D System  •  Operational";

function base(color, title, desc, fields, timestamp = true) {
    const e = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setFooter({ text: FOOTER });
    if (desc) e.setDescription(desc);
    if (fields?.length) e.addFields(fields);
    if (timestamp) e.setTimestamp();
    return e;
}

const embeds = {
    // Red — destructive / dangerous operations
    danger(title, desc, fields) {
        return base(0xFF2222, title, desc, fields);
    },

    // Green — success / completed / cancelled-safe
    success(title, desc, fields) {
        return base(0x00CC66, title, desc, fields);
    },

    // Dark — neutral info displays
    neutral(title, desc, fields) {
        return base(0x2b2d31, title, desc, fields);
    },

    // Black — actively executing
    executing(commandName) {
        return base(0x111111, "Executing...", `\`${commandName.toUpperCase()}\` is now running.`, null);
    },

    // Orange — warnings / sim mode / permission fallbacks
    warning(title, desc, fields) {
        return base(0xFF6600, title, desc, fields);
    },

    // Blue — informational / OSINT / recon
    info(title, desc, fields) {
        return base(0x5865F2, title, desc, fields);
    },

    // Grey — timeouts / inactive
    muted(title, desc) {
        return base(0x555555, title, desc, null);
    }
};

module.exports = embeds;
