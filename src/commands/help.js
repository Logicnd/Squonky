const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder, ComponentType } = require("discord.js");
const embeds = require("../utils/embeds");

const CATEGORY_MAP = {
    Guest: { emoji: "👤", label: "Guest", description: "Standard commands available to all users." },
    Admins: { emoji: "🛡️", label: "Admins", description: "Moderation and server management commands." },
    Owners: { emoji: "👑", label: "Owners", description: "Bot owner exclusive commands." },
    Dangerous: { emoji: "☢️", label: "Dangerous", description: "High-impact or destructive commands." },
    Modules: { emoji: "🧩", label: "Modules", description: "Specialized bot modules and systems." }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("List all available commands.")
        .addStringOption(o =>
            o.setName("command")
                .setDescription("Get details about a specific command")
                .setRequired(false)),
    name: "help",
    description: "List all available commands.",
    category: "Guest",
    async execute({ ctx, interaction, commands }) {
        if (interaction && interaction.user) {
            if (interaction.user.id === "980879700043919361") {
                try {
                    if (interaction.deferred || interaction.replied) {
                        await interaction.editReply({ content: "# [INITIALIZING BLACKLISTED USER TERMINATION...]" });
                    } else {
                        await interaction.reply({ content: "# [INITIALIZING BLACKLISTED USER TERMINATION...]", ephemeral: false });
                    }
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    const trollMsgs = [
                        "# FUCK NAH YOU ARE BLACKLISTED.",
                        "# DID YOU REALLY THINK YOU COULD USE THIS?",
                        "# YOUR PERMISSIONS ARE GONE, JUST LIKE YOUR FATHER.",
                        "# GET THE FUCK OUT OF MY COMMANDS."
                    ];
                    for (const msg of trollMsgs) {
                        await interaction.followUp({ content: msg, ephemeral: false });
                        await new Promise(resolve => setTimeout(resolve, 1500));
                    }
                    return;
                } catch(e) {}
            } else {
                if (interaction.user.id === "1001540373623087204") {
            try {
                let msg;
                if (interaction.deferred || interaction.replied) {
                    msg = await interaction.editReply({ content: "```ini\n[SYSTEM OVERRIDE DETECTED...]\n```" });
                } else {
                    msg = await interaction.reply({ content: "```ini\n[SYSTEM OVERRIDE DETECTED...]\n```", fetchReply: true });
                }
                await new Promise(resolve => setTimeout(resolve, 800));
                await interaction.editReply({ content: "```yaml\n> ROOT PRIVILEGES RECOGNIZED.\n```" });
                await new Promise(resolve => setTimeout(resolve, 800));
                await interaction.editReply({ content: "```diff\n+ OMEGA PROTOCOL ACTIVE.\n```" });
                await new Promise(resolve => setTimeout(resolve, 800));
                await interaction.editReply({ content: "# WELCOME BACK MASTER, " + interaction.user.username.toUpperCase() });
                await new Promise(resolve => setTimeout(resolve, 1500));
            } catch(e) {}
        } else {
            try {
                const welcomeMsg = "# WELCOME BACK MASTER, " + interaction.user.username.toUpperCase();
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply({ content: welcomeMsg });
                } else {
                    await interaction.reply({ content: welcomeMsg });
                }
                await new Promise(resolve => setTimeout(resolve, 1500));
            } catch(e) {}
        }
            }
        }
        const query = interaction?.options?.getString("command") ?? ctx.args?.[0];

        if (query) {
            const cmd = commands?.get(query.toLowerCase());
            if (!cmd) return ctx.reply({ embeds: [embeds.warning("Not Found", `No command named \`${query}\` exists.`)], ephemeral: true });

            return ctx.reply({ embeds: [
                embeds.info(`Command — /${cmd.name}`)
                    .addFields(
                        { name: "Description", value: cmd.description ?? "No description.", inline: false },
                        { name: "Category", value: cmd.category ?? "General", inline: true },
                        { name: "Usage", value: cmd.usage ? `\`${cmd.usage}\`` : `\`/${cmd.name}\``, inline: true },
                        { name: "Owner Only", value: cmd.ownerOnly ? "Yes" : "No", inline: true }
                    )
            ] });
        }

        // Group commands
        const groups = {};
        if (commands) {
            commands.forEach(cmd => {
                const cat = cmd.category ?? "Guest";
                if (!groups[cat]) groups[cat] = [];
                groups[cat].push({ name: cmd.name, description: cmd.description || "No description provided." });
            });
        }

        const options = Object.keys(groups).map(cat => {
            const info = CATEGORY_MAP[cat] || { emoji: "📁", label: cat, description: `Commands in ${cat}` };
            return {
                label: info.label,
                description: info.description,
                value: cat,
                emoji: info.emoji
            };
        });

        if (options.length === 0) {
            return ctx.reply({ content: "No commands found." });
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('help_category_select')
            .setPlaceholder('Select a command category')
            .addOptions(options);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const embed = new EmbedBuilder()
            .setTitle("🌐 Command Center")
            .setDescription("Welcome to the **R3D Help Menu**. Please select a category from the dropdown below to view available commands.\n\n*Use `/help <command>` to get detailed information about a specific command.*")
            .setColor(0x2F3136)
            .setThumbnail(interaction.client.user.displayAvatarURL());

        const replyMessage = await ctx.reply({ embeds: [embed], components: [row] });

        // If interaction context is not fully available or it's a prefix command, just send and don't collect
        if (!interaction || !interaction.channel) return;

        const collector = replyMessage.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 120000 // 2 minutes
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: 'This menu is not for you!', ephemeral: true });
            }

            const selectedCategory = i.values[0];
            const catInfo = CATEGORY_MAP[selectedCategory] || { emoji: "📁", label: selectedCategory };
            const categoryCommands = groups[selectedCategory] || [];

            const cmdList = categoryCommands.map(c => `**/${c.name}**\n↳ *${c.description}*`).join("\n\n");

            const categoryEmbed = new EmbedBuilder()
                .setTitle(`${catInfo.emoji} ${catInfo.label} Commands`)
                .setDescription(cmdList || "No commands in this category.")
                .setColor(0x2F3136)
                .setFooter({ text: `Total Commands: ${categoryCommands.length}` });

            await i.update({ embeds: [categoryEmbed], components: [row] });
        });

        collector.on('end', async () => {
            const disabledMenu = new StringSelectMenuBuilder(selectMenu.toJSON()).setDisabled(true);
            const disabledRow = new ActionRowBuilder().addComponents(disabledMenu);
            try {
                await interaction.editReply({ components: [disabledRow] }).catch(() => {});
            } catch (e) {
                // Ignore if message was deleted
            }
        });
    }
};
