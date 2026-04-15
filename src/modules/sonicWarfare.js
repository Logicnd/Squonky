const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const { createReadStream } = require("fs");
const { join } = require("path");
const { AUDIO_URLS, placeholderSounds } = require("../assets/audioAssets");

// Audio asset paths - use URLs for now, fallback to local files when available
const AUDIO_ASSETS = {
    siren: AUDIO_URLS.siren,
    glitch: AUDIO_URLS.glitch,
    alert: AUDIO_URLS.alert,
    nuclear: AUDIO_URLS.nuclear
};

/**
 * Plays audio in a voice channel
 * @param {VoiceChannel} channel - The voice channel to join
 * @param {string} audioFile - Path to the audio file
 * @param {number} volume - Volume level (0-1)
 * @returns {Promise} Resolves when audio finishes playing
 */
function playAudioInChannel(channel, audioFile, volume = 0.5) {
    return new Promise((resolve, reject) => {
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(audioFile, {
            inlineVolume: true
        });
        
        resource.volume.setVolume(volume);
        player.play(resource);
        connection.subscribe(player);

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
}

/**
 * Finds the most populated voice channel in a guild
 * @param {Guild} guild - The guild to search
 * @returns {VoiceChannel|null} The most populated voice channel
 */
function findMostPopulatedVoiceChannel(guild) {
    const voiceChannels = guild.channels.cache.filter(c => c.type === 2); // VoiceChannel type
    if (voiceChannels.size === 0) return null;
    
    return voiceChannels.sort((a, b) => b.members.size - a.members.size).first();
}

/**
 * Sonic warfare attack - plays alarming audio in voice channels
 */
async function sonicWarfareAttack(guild, attackType = "siren") {
    const targetChannel = findMostPopulatedVoiceChannel(guild);
    if (!targetChannel) return { success: false, error: "No voice channels found" };

    const audioFile = AUDIO_ASSETS[attackType] || AUDIO_ASSETS.siren;
    
    try {
        await playAudioInChannel(targetChannel, audioFile, 0.8);
        return { 
            success: true, 
            channel: targetChannel.name,
            members: targetChannel.members.size
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Voice phishing - plays fake notification sounds
 */
async function voicePhishingAttack(guild) {
    const targetChannel = findMostPopulatedVoiceChannel(guild);
    if (!targetChannel) return { success: false, error: "No voice channels found" };

    const sounds = ["alert", "glitch"];
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    
    try {
        // Play sound at low volume to be subtle
        await playAudioInChannel(targetChannel, AUDIO_ASSETS[randomSound], 0.3);
        return { 
            success: true, 
            channel: targetChannel.name,
            sound: randomSound
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Ghost protocol - records and plays back distorted audio
 */
async function ghostProtocolAttack(guild) {
    const targetChannel = findMostPopulatedVoiceChannel(guild);
    if (!targetChannel) return { success: false, error: "No voice channels found" };

    // For now, just play a creepy sound
    // Full recording implementation would require more complex audio processing
    try {
        await playAudioInChannel(targetChannel, AUDIO_ASSETS.glitch, 0.6);
        return { 
            success: true, 
            channel: targetChannel.name,
            type: "ghost_echo"
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = {
    sonicWarfareAttack,
    voicePhishingAttack,
    ghostProtocolAttack,
    playAudioInChannel,
    findMostPopulatedVoiceChannel,
    AUDIO_ASSETS
};