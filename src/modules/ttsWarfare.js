const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const https = require("https");
const { Readable } = require("stream");

/**
 * Converts text to speech using Google's TTS API
 * @param {string} text - Text to convert to speech
 * @param {string} language - Language code (default: en)
 * @returns {Promise<Buffer>} Audio buffer
 */
function textToSpeech(text, language = "en") {
    return new Promise((resolve, reject) => {
        // Google TTS API endpoint (free, no key required)
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${language}&client=tw-ob`;
        
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`TTS API error: ${response.statusCode}`));
                return;
            }
            
            const chunks = [];
            response.on("data", chunk => chunks.push(chunk));
            response.on("end", () => resolve(Buffer.concat(chunks)));
            response.on("error", reject);
        }).on("error", reject);
    });
}

/**
 * Plays TTS audio in a voice channel
 * @param {VoiceChannel} channel - The voice channel to join
 * @param {string} text - Text to speak
 * @param {string} language - Language code
 * @param {number} volume - Volume level (0-1)
 * @returns {Promise} Resolves when audio finishes playing
 */
async function playTTSInChannel(channel, text, language = "en", volume = 0.7) {
    try {
        const audioBuffer = await textToSpeech(text, language);
        const audioStream = Readable.from(audioBuffer);
        
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(audioStream, {
            inlineVolume: true
        });
        
        resource.volume.setVolume(volume);
        player.play(resource);
        connection.subscribe(player);

        return new Promise((resolve, reject) => {
            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy();
                resolve();
            });

            player.on("error", (error) => {
                connection.destroy();
                reject(error);
            });

            // Auto-disconnect after 30 seconds max
            setTimeout(() => {
                connection.destroy();
                resolve();
            }, 30000);
        });
    } catch (error) {
        throw new Error(`TTS playback failed: ${error.message}`);
    }
}

/**
 * Predefined TTS warnings for different scenarios
 */
const TTS_WARNINGS = {
    INTRUDER_ALERT: "Intruder alert. Unauthorized access detected. Security protocols activated.",
    SYSTEM_BREACH: "Warning. System breach in progress. All personnel evacuate immediately.",
    VOICE_PHISHING: "Attention. This is a security announcement. Do not trust unknown voices.",
    SONIC_WARFARE: "Sonic warfare detected. Protect your hearing. Emergency protocols engaged.",
    GHOST_PROTOCOL: "Ghost protocol initiated. System is now under spectral surveillance.",
    NUCLEAR_ALERT: "Nuclear alert. This is not a drill. Seek immediate shelter.",
    NETWORK_COMPROMISE: "Network compromise detected. All systems are vulnerable. Disconnect now.",
    VOICE_SURVEILLANCE: "Voice surveillance active. All conversations are being monitored.",
    PSYCHOLOGICAL_WARFARE: "Psychological warfare in progress. Remain calm and follow protocols.",
    FINAL_WARNING: "Final warning. System termination imminent. Save all data immediately."
};

/**
 * Deploys a TTS warning in a voice channel
 * @param {VoiceChannel} channel - Target voice channel
 * @param {string} warningType - Type of warning from TTS_WARNINGS
 * @param {Object} options - Additional options
 * @returns {Promise} Resolves when warning is delivered
 */
async function deployTTSWarning(channel, warningType, options = {}) {
    const { 
        customText = null, 
        language = "en", 
        volume = 0.7, 
        repeat = 1,
        delay = 0 
    } = options;
    
    const text = customText || TTS_WARNINGS[warningType] || warningType;
    
    if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    for (let i = 0; i < repeat; i++) {
        await playTTSInChannel(channel, text, language, volume);
        if (i < repeat - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

/**
 * Multi-channel TTS deployment
 * @param {Guild} guild - Discord guild
 * @param {string[]} warningTypes - Array of warning types
 * @param {Object} options - Deployment options
 * @returns {Promise} Resolves when all warnings are delivered
 */
async function deployMultiChannelTTS(guild, warningTypes, options = {}) {
    const voiceChannels = guild.channels.cache.filter(channel => 
        channel.type === 2 && channel.members.size > 0
    );
    
    if (voiceChannels.size === 0) {
        throw new Error("No active voice channels found");
    }
    
    const deployments = [];
    
    for (const channel of voiceChannels.values()) {
        for (const warningType of warningTypes) {
            deployments.push(deployTTSWarning(channel, warningType, options));
        }
    }
    
    await Promise.allSettled(deployments);
}

module.exports = {
    textToSpeech,
    playTTSInChannel,
    TTS_WARNINGS,
    deployTTSWarning,
    deployMultiChannelTTS
};