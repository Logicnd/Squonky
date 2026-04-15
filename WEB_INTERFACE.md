# 🌐 R3D Bot Web Interface

A comprehensive web dashboard and control panel for the R3D Discord bot, featuring real-time monitoring, voice warfare controls, and live bot interaction.

## ✨ Features

### 📊 Real-time Dashboard
- **Live Bot Status**: Monitor bot connectivity, uptime, and health
- **Activity Feed**: Real-time Discord activity monitoring
- **Command Statistics**: Track command usage and performance
- **Voice Warfare Metrics**: Monitor voice warfare deployments and effects

### 🎧 Voice Warfare Control Panel
- **Sonic Warfare Arsenal**: Deploy siren, glitch, nuclear, ghost, and phishing attacks
- **TTS Warning System**: Deploy text-to-speech warnings with predefined messages
- **Ghost Protocol**: Execute spectral surveillance and reverse audio warfare
- **Voice Suppression**: Simulate voice manipulation effects (mute, deafen, robot voice)
- **Multi-Channel Support**: Target single channels or deploy across all voice channels
- **Real-time Deployment Status**: Live feedback on voice command execution

### 🎯 Target Selection
- **Server Browser**: Select from all connected Discord servers
- **Voice Channel Selector**: Choose specific voice channels or multi-channel mode
- **Live Member Counts**: See current voice channel populations

### 🔧 Technical Features
- **WebSocket Integration**: Real-time bidirectional communication
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional interface with smooth animations
- **Error Handling**: Comprehensive error reporting and recovery

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- R3D Discord bot running
- Discord bot token configured in `.env`

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Bot with Web Interface**
   ```bash
   # Windows
   start-with-web.bat
   
   # PowerShell
   ./start-with-web.ps1
   
   # Manual
   node src/index.js
   ```

3. **Access the Web Interface**
   - Dashboard: http://localhost:3000
   - Voice Warfare Control: http://localhost:3000/voice-warfare

## 📱 Interface Overview

### Main Dashboard
The main dashboard provides a comprehensive overview of your bot's status and activity:

- **Bot Status Card**: Shows online/offline status, server count, user count, and uptime
- **Live Activity Feed**: Real-time Discord messages and voice state updates
- **Quick Actions**: One-click buttons for common commands
- **Command Statistics**: Visual breakdown of command usage
- **Voice Warfare Stats**: Deployment counts, success rates, and user engagement

### Voice Warfare Control Panel
The voice warfare panel provides complete control over audio warfare operations:

#### 🎧 Sonic Warfare Section
- **Attack Types**: Siren Assault, Glitch Storm, Nuclear Alert, Ghost Echo, Voice Phishing
- **Single Click Deployment**: Select attack type and deploy instantly
- **Real-time Feedback**: Live status updates on deployment progress

#### 🔊 TTS Warnings Section
- **Predefined Messages**: 10+ warning types including Intruder Alert, System Breach, Nuclear Alert
- **Custom Text Support**: Option to add custom TTS messages
- **Repeat & Delay**: Configure message repetition and deployment delays
- **Multi-Channel Mode**: Deploy to all active voice channels simultaneously

#### 👻 Ghost Protocol Section
- **Spectral Effects**: Reverse Speech, Spectral Echo, Audio Distortion, Voice Surveillance, Void Protocol
- **Custom Messages**: Add personalized ghost protocol messages
- **Duration Control**: Set deployment duration (10-300 seconds)
- **Multi-Channel Support**: Target multiple channels at once

#### 🔇 Voice Suppression Section
- **Simulation Effects**: Mute Simulation, Deafen Simulation, Robot Voice, Voice Distortion
- **Echo Chamber**: Create reverberation effects
- **Voice Reversal**: Play audio backwards for psychological impact
- **Crowd Simulation**: Add background crowd noise

#### 💥 Advanced Warfare
- **Voice Siege**: Launch sustained multi-channel assaults with strategies like Blitz, Attrition, PsyOps, Annihilation
- **Voice Bomb**: Deploy concentrated audio assaults with adjustable intensity levels
- **Multi-Channel Mode**: Execute attacks across all voice channels in a server

## 🎯 Usage Guide

### Basic Voice Warfare Deployment

1. **Select Target**
   - Choose your Discord server from the dropdown
   - Select a specific voice channel or enable multi-channel mode
   - Check member counts to see active voice channels

2. **Choose Weapon**
   - Pick from sonic warfare, TTS warnings, ghost protocol, or voice suppression
   - Configure options like attack type, duration, and intensity

3. **Deploy Attack**
   - Click the deployment button
   - Monitor real-time status updates
   - View deployment history and success rates

### Advanced Multi-Channel Operations

1. **Enable Multi-Channel Mode**
   - Select "Multi-Channel" in the mode dropdown
   - System will target all active voice channels

2. **Coordinate Attacks**
   - Use Voice Siege for sustained operations
   - Deploy different attack types in sequence
   - Monitor overall campaign effectiveness

3. **Track Results**
   - View deployment statistics in real-time
   - Check success rates and user engagement
   - Analyze which attacks are most effective

## 🔧 Configuration

### Environment Variables
```bash
# Web Server Configuration
WEB_PORT=3000              # Web server port (default: 3000)
WEB_HOST=localhost         # Web server host (default: localhost)
WEB_UPDATE_INTERVAL=5000   # Metrics update interval in ms (default: 5000)
```

### Voice Warfare Settings
```bash
# Voice Command Cooldowns
VOICE_COOLDOWN_GLOBAL=15000      # Global cooldown between voice commands (ms)
VOICE_MAX_DURATION=300           # Maximum voice deployment duration (seconds)
VOICE_DEFAULT_VOLUME=0.7          # Default audio volume (0.0-1.0)
```

## 📊 Metrics and Monitoring

### Real-time Metrics
- **Total Deployments**: Overall voice warfare usage
- **Success Rate**: Percentage of successful deployments
- **Users Affected**: Number of unique users impacted
- **Average Duration**: Mean deployment time
- **Multi-Channel Operations**: Cross-channel deployment statistics

### Command-Specific Analytics
- **Sonic Warfare Usage**: Breakdown by attack type
- **TTS Message Statistics**: Warning deployment frequency
- **Ghost Protocol Effects**: Spectral warfare effectiveness
- **Voice Suppression Metrics**: Simulation success rates

### Server Performance
- **Connection Health**: WebSocket connection status
- **API Response Times**: Discord API interaction speeds
- **Memory Usage**: Bot resource consumption
- **Error Rates**: Failure analysis and reporting

## 🛡️ Safety Features

### Built-in Protections
- **Automatic Cooldowns**: Prevents command spam
- **Volume Limits**: Maximum 100% to prevent hearing damage
- **Duration Limits**: Maximum 5-minute continuous playback
- **Permission Checks**: Respects Discord role permissions
- **Error Recovery**: Graceful handling of connection failures

### Best Practices
- **Test in Safe Environment**: Use test servers before production deployment
- **Monitor User Feedback**: Watch for negative reactions to voice effects
- **Respect Discord ToS**: Follow Discord's Terms of Service
- **Use Sparingly**: Voice warfare should enhance, not disrupt, user experience

## 🚨 Troubleshooting

### Common Issues

**Web Interface Won't Load**
- Check if port 3000 is available
- Verify bot is running and authenticated
- Check firewall settings

**Voice Commands Not Working**
- Ensure bot has voice channel permissions
- Check if bot is in the target voice channel
- Verify audio file availability

**Real-time Updates Not Working**
- Check WebSocket connection status
- Verify browser compatibility
- Check for JavaScript errors in browser console

**Deployment Failures**
- Verify target voice channels have active members
- Check command cooldown status
- Review bot permissions in target server

### Debug Information
- Check browser console for JavaScript errors
- Monitor bot logs for connection issues
- Use `/voicemetrics` command for voice warfare statistics
- Check Discord API status for external issues

## 🔧 Advanced Usage

### Custom Integration
The web interface exposes several API endpoints:

```javascript
// Get bot status
GET /api/status

// Get metrics
GET /api/metrics
GET /api/voice-metrics

// Get guild list
GET /api/guilds

// Execute commands
POST /api/execute-command
POST /api/voice-command
```

### WebSocket Events
Connect to WebSocket for real-time updates:

```javascript
const socket = io('http://localhost:3000');

socket.on('bot-status', (status) => {
    console.log('Bot status:', status);
});

socket.on('voice-command-result', (result) => {
    console.log('Voice command result:', result);
});
```

## 🎨 Customization

### Styling
The interface uses Tailwind CSS for styling. Customize colors, layouts, and components by modifying the CSS classes in the EJS templates.

### Adding New Features
1. Extend the WebServer class in `web/server.js`
2. Add new API endpoints in the `setupRoutes()` method
3. Create new EJS templates in `web/views/`
4. Update the web integration module in `src/modules/webIntegration.js`

## 📈 Performance Optimization

### Scaling Tips
- Use a reverse proxy (nginx) for production deployments
- Implement Redis for session management in multi-instance setups
- Monitor memory usage and restart periodically if needed
- Use CDN for static assets in production

### Security Considerations
- Implement authentication for production use
- Use HTTPS with proper SSL certificates
- Rate limit API endpoints
- Validate all user inputs
- Keep dependencies updated

---

**Note**: This web interface is designed for educational and entertainment purposes. Always respect Discord's Terms of Service and community guidelines when using voice warfare features.