const WebServer = require('../../web/server');
const { recordVoiceDeployment, recordVoiceConnection } = require('../services/metrics');

class WebIntegration {
    constructor(botClient, commands) {
        this.botClient = botClient;
        this.commands = commands;
        this.webServer = new WebServer(botClient);
        this.setupCommandIntegration();
    }

    setupCommandIntegration() {
        // Override the web server's executeCommand method to integrate with actual bot commands
        this.webServer.executeCommand = async (commandName, options = {}, guildId, channelId) => {
            return await this.executeBotCommand(commandName, options, guildId, channelId);
        };

        // Override the web server's executeVoiceCommand method to integrate with voice warfare
        this.webServer.executeVoiceCommand = async (commandName, options = {}, guildId, voiceChannelId) => {
            return await this.executeVoiceWarfareCommand(commandName, options, guildId, voiceChannelId);
        };
    }

    async executeBotCommand(commandName, options = {}, guildId, channelId) {
        try {
            const command = this.commands.get(commandName);
            if (!command) {
                return { success: false, error: `Command ${commandName} not found` };
            }

            const guild = this.botClient.guilds.cache.get(guildId);
            if (!guild) {
                return { success: false, error: 'Guild not found' };
            }

            const channel = guild.channels.cache.get(channelId);
            if (!channel) {
                return { success: false, error: 'Channel not found' };
            }

            // Create a mock interaction/context for command execution
            const mockContext = {
                guild: guild,
                channel: channel,
                user: { id: 'web_interface_user' },
                member: guild.members.cache.first(), // Use first member as placeholder
                reply: async (response) => {
                    return { success: true, response };
                },
                followUp: async (response) => {
                    return { success: true, response };
                }
            };

            // Execute the command
            const result = await command.execute({
                interaction: mockContext,
                message: null,
                args: Object.values(options),
                guild: guild
            });

            return { success: true, result };
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            return { success: false, error: error.message };
        }
    }

    async executeVoiceWarfareCommand(commandName, options = {}, guildId, voiceChannelId) {
        try {
            const voiceCommand = this.commands.get(commandName);
            if (!voiceCommand) {
                return { success: false, error: `Voice command ${commandName} not found` };
            }

            const guild = this.botClient.guilds.cache.get(guildId);
            if (!guild) {
                return { success: false, error: 'Guild not found' };
            }

            let voiceChannel = null;
            if (voiceChannelId) {
                voiceChannel = guild.channels.cache.get(voiceChannelId);
                if (!voiceChannel || voiceChannel.type !== 2) { // 2 is GUILD_VOICE
                    return { success: false, error: 'Voice channel not found' };
                }
            }

            // Create a mock interaction/context for voice command execution
            const mockContext = {
                guild: guild,
                channel: guild.channels.cache.first(), // Use first text channel as placeholder
                user: { id: 'web_interface_user' },
                member: guild.members.cache.first(),
                options: {
                    getString: (name) => options[name] || null,
                    getInteger: (name) => options[name] || null,
                    getBoolean: (name) => options[name] || null,
                    getUser: (name) => options[name] || null
                },
                reply: async (response) => {
                    return { success: true, response };
                },
                followUp: async (response) => {
                    return { success: true, response };
                }
            };

            // Set up voice channel if specified
            if (voiceChannel) {
                mockContext.member.voice = { channel: voiceChannel };
            }

            // Record voice deployment metrics
            const duration = options.duration || options.delay || 30; // Default duration
            const isMultiChannel = options.all_channels || false;
            recordVoiceDeployment(commandName, guildId, voiceChannelId, duration, isMultiChannel, commandName);
            recordVoiceConnection(true, `${guildId}-${voiceChannelId || 'multi'}`);

            // Execute the voice command
            const result = await voiceCommand.execute({
                interaction: mockContext,
                message: null,
                args: [],
                guild: guild
            });

            return { 
                success: true, 
                result,
                message: `Voice command ${commandName} executed successfully`,
                affectedChannels: isMultiChannel ? 'all active voice channels' : voiceChannel?.name || 'unknown channel'
            };
        } catch (error) {
            console.error(`Error executing voice command ${commandName}:`, error);
            recordVoiceConnection(false, `${guildId}-${voiceChannelId || 'multi'}`);
            return { success: false, error: error.message };
        }
    }

    start(port = 3000) {
        this.webServer.start(port);
        console.log(`🌐 Web integration started on port ${port}`);
        console.log(`📊 Dashboard: http://localhost:${port}`);
        console.log(`🎧 Voice Warfare: http://localhost:${port}/voice-warfare`);
    }

    stop() {
        this.webServer.stop();
        console.log('🌐 Web integration stopped');
    }

    // Method to broadcast custom events to web clients
    broadcast(event, data) {
        this.webServer.io.emit(event, data);
    }

    // Method to get web server instance for advanced usage
    getWebServer() {
        return this.webServer;
    }
}

module.exports = WebIntegration;