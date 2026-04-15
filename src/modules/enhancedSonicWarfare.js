const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const { AUDIO_URLS } = require("../assets/audioAssets");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { createWriteStream } = require("fs");

const TEMP_DIR = path.join(__dirname, "../temp");
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

/**
 * Downloads audio file from URL to temp directory
 */
function downloadAudio(url, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(TEMP_DIR, filename);
        const file = createWriteStream(filePath);
        
        https.get(url, (response) => {
            response.pipe(file);
            file.on("finish", () => {
                file.close();
                resolve(filePath);
            });
        }).on("error", (err) => {
            fs.unlink(filePath, () => {}); // Delete the file async
            reject(err);
        });
    });
}

/**
 * Plays audio in a voice channel from URL
 */
async function playAudioFromUrl(channel, audioUrl, volume = 0.5) {
    try {
        // Download the audio file first
        const filename = `audio_${Date.now()}.wav`;
        const filePath = await downloadAudio(audioUrl, filename);
        
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(filePath, {
            inlineVolume: true
        });
        
        resource.volume.setVolume(volume);
        player.play(resource);
        connection.subscribe(player);

        return new Promise((resolve, reject) => {
            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy();
                fs.unlink(filePath, () => {}); // Clean up temp file
                resolve();
            });

            player.on("error", (error) => {
                connection.destroy();
                fs.unlink(filePath, () => {});
                reject(error);
            });

            // Auto-disconnect after 30 seconds max
            setTimeout(() => {
                connection.destroy();
                fs.unlink(filePath, () => {});
                resolve();
            }, 30000);
        });
    } catch (error) {
        throw new Error(`Failed to play audio: ${error.message}`);
    }
}

/**
 * Enhanced sonic warfare with URL-based audio
 */
async function enhancedSonicWarfareAttack(guild, attackType = "siren") {
    const targetChannel = guild.channels.cache
        .filter(c => c.type === 2 && c.members.size > 0)
        .sort((a, b) => b.members.size - a.members.size)
        .first();

    if (!targetChannel) {
        return { success: false, error: "No active voice channels found" };
    }

    const audioUrl = AUDIO_URLS[attackType] || AUDIO_URLS.siren;
    
    try {
        await playAudioFromUrl(targetChannel, audioUrl, 0.8);
        return { 
            success: true, 
            channel: targetChannel.name,
            members: targetChannel.members.size,
            attack: attackType
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Multi-channel audio assault
 */
async function multiChannelAudioAttack(guild, attackTypes = ["siren", "glitch"]) {
    const voiceChannels = guild.channels.cache
        .filter(c => c.type === 2 && c.members.size > 0)
        .sort((a, b) => b.members.size - a.members.size);

    if (voiceChannels.size === 0) {
        return { success: false, error: "No active voice channels found" };
    }

    const results = [];
    let deployedCount = 0;

    for (const [channelId, channel] of voiceChannels) {
        if (deployedCount >= Math.min(voiceChannels.size, 3)) break; // Max 3 channels
        
        const attackType = attackTypes[deployedCount % attackTypes.length];
        const audioUrl = AUDIO_URLS[attackType] || AUDIO_URLS.siren;
        
        try {
            await playAudioFromUrl(channel, audioUrl, 0.7);
            results.push({
                channel: channel.name,
                members: channel.members.size,
                attack: attackType,
                success: true
            });
            deployedCount++;
            
            // Delay between channel attacks
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            results.push({
                channel: channel.name,
                error: error.message,
                success: false
            });
        }
    }

    return {
        success: results.some(r => r.success),
        results,
        totalChannels: voiceChannels.size,
        deployedCount
    };
}

/**
 * Voice channel surveillance - records voice activity (simulated)
 */
async function voiceSurveillance(guild, duration = 30) {
    const voiceChannels = guild.channels.cache.filter(c => c.type === 2);
    const activeChannels = voiceChannels.filter(c => c.members.size > 0);

    return {
        totalChannels: voiceChannels.size,
        activeChannels: activeChannels.size,
        totalMembers: activeChannels.reduce((sum, c) => sum + c.members.size, 0),
        channels: activeChannels.map(c => ({
            name: c.name,
            members: c.members.size,
            memberNames: c.members.map(m => m.displayName)
        }))
    };
}

module.exports = {
    playAudioFromUrl,
    enhancedSonicWarfareAttack,
    multiChannelAudioAttack,
    voiceSurveillance,
    downloadAudio
};