const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
const config = require('../src/config');
const { getVoiceMetrics } = require('../src/services/metrics');
const { snapshot } = require('../src/services/metrics');

class WebServer {
    constructor(botClient) {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIo(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        this.botClient = botClient;
        this.setupMiddleware();
        this.setupRoutes();
        this.setupSocketHandlers();
        this.setupBotIntegration();
    }

    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.join(__dirname, 'views'));
    }

    setupRoutes() {
        // Main dashboard
        this.app.get('/', (req, res) => {
            res.render('dashboard', {
                title: 'R3D Bot Control Panel',
                botStatus: this.getBotStatus(),
                metrics: snapshot()
            });
        });

        // Voice warfare control panel
        this.app.get('/voice-warfare', (req, res) => {
            res.render('voice-warfare', {
                title: 'Voice Warfare Control',
                voiceMetrics: getVoiceMetrics(),
                availableCommands: this.getVoiceCommands()
            });
        });

        // Bot status API
        this.app.get('/api/status', (req, res) => {
            res.json({
                status: 'online',
                uptime: process.uptime(),
                readyAt: this.botClient.readyAt,
                guilds: this.botClient.guilds.cache.size,
                users: this.botClient.users.cache.size,
                channels: this.botClient.channels.cache.size,
                voiceConnections: this.botClient.voice?.adapters?.size || 0
            });
        });

        // Metrics API
        this.app.get('/api/metrics', (req, res) => {
            res.json(snapshot());
        });

        // Voice metrics API
        this.app.get('/api/voice-metrics', (req, res) => {
            res.json(getVoiceMetrics());
        });

        // Command execution API
        this.app.post('/api/execute-command', async (req, res) => {
            try {
                const { command, options, guildId, channelId } = req.body;
                const result = await this.executeCommand(command, options, guildId, channelId);
                res.json({ success: true, result });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Voice command execution API
        this.app.post('/api/voice-command', async (req, res) => {
            try {
                const { command, options, guildId, voiceChannelId } = req.body;
                const result = await this.executeVoiceCommand(command, options, guildId, voiceChannelId);
                res.json({ success: true, result });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Guild list API
        this.app.get('/api/guilds', (req, res) => {
            const guilds = Array.from(this.botClient.guilds.cache.values()).map(guild => ({
                id: guild.id,
                name: guild.name,
                memberCount: guild.memberCount,
                icon: guild.iconURL(),
                voiceChannels: guild.channels.cache.filter(ch => ch.type === 2).map(ch => ({
                    id: ch.id,
                    name: ch.name,
                    memberCount: ch.members.size
                }))
            }));
            res.json(guilds);
        });
    }

    setupSocketHandlers() {
        this.io.on('connection', (socket) => {
            console.log('Web client connected:', socket.id);
            
            // Send initial bot status
            socket.emit('bot-status', this.getBotStatus());
            socket.emit('metrics-update', snapshot());
            socket.emit('voice-metrics-update', getVoiceMetrics());

            // Handle command execution from web interface
            socket.on('execute-command', async (data) => {
                try {
                    const result = await this.executeCommand(data.command, data.options, data.guildId, data.channelId);
                    socket.emit('command-result', { success: true, result, command: data.command });
                } catch (error) {
                    socket.emit('command-result', { success: false, error: error.message, command: data.command });
                }
            });

            // Handle voice command execution
            socket.on('execute-voice-command', async (data) => {
                try {
                    const result = await this.executeVoiceCommand(data.command, data.options, data.guildId, data.voiceChannelId);
                    socket.emit('voice-command-result', { success: true, result, command: data.command });
                } catch (error) {
                    socket.emit('voice-command-result', { success: false, error: error.message, command: data.command });
                }
            });

            socket.on('disconnect', () => {
                console.log('Web client disconnected:', socket.id);
            });
        });

        // Broadcast metrics updates every 5 seconds
        setInterval(() => {
            this.io.emit('metrics-update', snapshot());
            this.io.emit('voice-metrics-update', getVoiceMetrics());
            this.io.emit('bot-status', this.getBotStatus());
        }, 5000);
    }

    setupBotIntegration() {
        // Listen to bot events and broadcast to web clients
        this.botClient.on('messageCreate', (message) => {
            this.io.emit('message-create', {
                id: message.id,
                content: message.content,
                author: {
                    id: message.author.id,
                    username: message.author.username,
                    avatar: message.author.avatarURL()
                },
                channel: {
                    id: message.channel.id,
                    name: message.channel.name
                },
                guild: message.guild ? {
                    id: message.guild.id,
                    name: message.guild.name
                } : null,
                timestamp: message.createdAt
            });
        });

        this.botClient.on('voiceStateUpdate', (oldState, newState) => {
            this.io.emit('voice-state-update', {
                userId: newState.member.id,
                username: newState.member.user.username,
                oldChannel: oldState.channel ? {
                    id: oldState.channel.id,
                    name: oldState.channel.name
                } : null,
                newChannel: newState.channel ? {
                    id: newState.channel.id,
                    name: newState.channel.name
                } : null,
                guild: {
                    id: newState.guild.id,
                    name: newState.guild.name
                }
            });
        });
    }

    getBotStatus() {
        return {
            ready: this.botClient.readyAt !== null,
            status: this.botClient.presence?.status || 'offline',
            uptime: process.uptime(),
            guilds: this.botClient.guilds.cache.size,
            users: this.botClient.users.cache.size,
            channels: this.botClient.channels.cache.size,
            readyAt: this.botClient.readyAt
        };
    }

    getVoiceCommands() {
        return [
            { name: 'sonicwarfare', description: 'Deploy sonic weapons', cooldown: 30 },
            { name: 'ttswarning', description: 'Deploy TTS warnings', cooldown: 45 },
            { name: 'voicesiege', description: 'Multi-channel siege warfare', cooldown: 120 },
            { name: 'ghostprotocol', description: 'Spectral surveillance', cooldown: 90 },
            { name: 'voicesuppression', description: 'Voice manipulation simulation', cooldown: 30 },
            { name: 'voicebomb', description: 'Concentrated audio assault', cooldown: 60 },
            { name: 'soundboardhijack', description: 'Soundboard hijacking', cooldown: 45 }
        ];
    }

    async executeCommand(command, options = {}, guildId, channelId) {
        // This would integrate with your existing command system
        // For now, return a simulated result
        return {
            success: true,
            message: `Command ${command} executed with options: ${JSON.stringify(options)}`,
            guildId,
            channelId
        };
    }

    async executeVoiceCommand(command, options = {}, guildId, voiceChannelId) {
        // This would integrate with your voice warfare system
        // For now, return a simulated result
        return {
            success: true,
            message: `Voice command ${command} executed in voice channel ${voiceChannelId}`,
            guildId,
            voiceChannelId,
            options
        };
    }

    start(port = 3000) {
        this.server.listen(port, () => {
            console.log(`🌐 Web server running on http://localhost:${port}`);
            console.log(`📊 Dashboard available at http://localhost:${port}`);
            console.log(`🎧 Voice Warfare Panel at http://localhost:${port}/voice-warfare`);
        });
    }

    stop() {
        this.server.close();
    }
}

module.exports = WebServer;