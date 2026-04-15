const { createAudioResource } = require("@discordjs/voice");
const { Readable } = require("stream");

const { recordAudioEffect } = require("../services/metrics");

/**
 * Creates audio distortion effects for ghost protocol and other special attacks
 */

/**
 * Applies pitch shift effect to audio data
 * @param {Buffer} audioBuffer - Original audio buffer
 * @param {number} pitchFactor - Pitch shift factor (0.5 = half speed, 2.0 = double speed)
 * @returns {Buffer} Processed audio buffer
 */
function applyPitchShift(audioBuffer, pitchFactor = 0.7) {
    // Simple pitch shift by resampling
    const sampleRate = 48000; // Standard Discord sample rate
    const newLength = Math.floor(audioBuffer.length / pitchFactor);
    const processedBuffer = Buffer.alloc(newLength);
    
    for (let i = 0; i < newLength; i++) {
        const sourceIndex = Math.floor(i * pitchFactor);
        if (sourceIndex < audioBuffer.length) {
            processedBuffer[i] = audioBuffer[sourceIndex];
        }
    }
    
    return processedBuffer;
}

/**
 * Applies echo effect to audio data
 * @param {Buffer} audioBuffer - Original audio buffer
 * @param {number} delayMs - Echo delay in milliseconds
 * @param {number} decay - Echo decay factor (0.0-1.0)
 * @returns {Buffer} Processed audio buffer
 */
function applyEcho(audioBuffer, delayMs = 200, decay = 0.5) {
    const sampleRate = 48000;
    const delaySamples = Math.floor((delayMs / 1000) * sampleRate);
    const processedBuffer = Buffer.from(audioBuffer);
    
    for (let i = delaySamples; i < processedBuffer.length; i++) {
        const echoSample = processedBuffer[i - delaySamples] * decay;
        processedBuffer[i] = Math.min(255, Math.max(0, processedBuffer[i] + echoSample));
    }
    
    return processedBuffer;
}

/**
 * Applies reverse audio effect
 * @param {Buffer} audioBuffer - Original audio buffer
 * @returns {Buffer} Reversed audio buffer
 */
function applyReverse(audioBuffer) {
    const reversedBuffer = Buffer.alloc(audioBuffer.length);
    for (let i = 0; i < audioBuffer.length; i++) {
        reversedBuffer[i] = audioBuffer[audioBuffer.length - 1 - i];
    }
    return reversedBuffer;
}

/**
 * Applies static/noise effect
 * @param {Buffer} audioBuffer - Original audio buffer
 * @param {number} noiseLevel - Noise intensity (0.0-1.0)
 * @returns {Buffer} Processed audio buffer
 */
function applyStaticNoise(audioBuffer, noiseLevel = 0.3) {
    const processedBuffer = Buffer.from(audioBuffer);
    
    for (let i = 0; i < processedBuffer.length; i++) {
        const noise = (Math.random() - 0.5) * noiseLevel * 255;
        processedBuffer[i] = Math.min(255, Math.max(0, processedBuffer[i] + noise));
    }
    
    return processedBuffer;
}

/**
 * Applies ghost protocol specific effects (reverse + echo + pitch shift)
 * @param {Buffer} audioBuffer - Original audio buffer
 * @returns {Buffer} Ghost protocol audio buffer
 */
function applyGhostProtocolEffects(audioBuffer) {
    recordAudioEffect("ghostProtocol");
    let processed = applyReverse(audioBuffer);
    processed = applyEcho(processed, 300, 0.4);
    processed = applyPitchShift(processed, 0.6);
    processed = applyStaticNoise(processed, 0.2);
    return processed;
}

/**
 * Applies glitch storm effects (random pitch shifts + static)
 * @param {Buffer} audioBuffer - Original audio buffer
 * @returns {Buffer} Glitch storm audio buffer
 */
function applyGlitchStormEffects(audioBuffer) {
    let processed = Buffer.from(audioBuffer);
    
    // Apply random glitch segments
    const segmentSize = Math.floor(processed.length / 8);
    for (let i = 0; i < 8; i++) {
        const start = i * segmentSize;
        const end = Math.min(start + segmentSize, processed.length);
        const segment = processed.slice(start, end);
        
        // Random pitch shift for each segment
        const pitchFactor = 0.5 + Math.random() * 1.5;
        const glitchedSegment = applyPitchShift(segment, pitchFactor);
        
        // Copy back to main buffer
        for (let j = 0; j < glitchedSegment.length && start + j < processed.length; j++) {
            processed[start + j] = glitchedSegment[j];
        }
    }
    
    processed = applyStaticNoise(processed, 0.4);
    return processed;
}

/**
 * Creates a silent audio buffer for placeholder effects
 * @param {number} durationMs - Duration in milliseconds
 * @param {number} sampleRate - Audio sample rate
 * @returns {Buffer} Silent audio buffer
 */
function createSilentBuffer(durationMs = 1000, sampleRate = 48000) {
    const byteRate = sampleRate * 2; // 16-bit audio
    const totalBytes = Math.floor((durationMs / 1000) * byteRate);
    return Buffer.alloc(totalBytes, 128); // Mid-level silence for 16-bit audio
}

/**
 * Creates a sine wave tone
 * @param {number} frequency - Tone frequency in Hz
 * @param {number} durationMs - Duration in milliseconds
 * @param {number} sampleRate - Audio sample rate
 * @returns {Buffer} Tone audio buffer
 */
function createTone(frequency = 440, durationMs = 1000, sampleRate = 48000) {
    const samples = Math.floor((durationMs / 1000) * sampleRate);
    const buffer = Buffer.alloc(samples * 2); // 16-bit audio
    
    for (let i = 0; i < samples; i++) {
        const time = i / sampleRate;
        const value = Math.sin(2 * Math.PI * frequency * time);
        const sample = Math.floor(value * 32767); // 16-bit max value
        
        // Write as little-endian 16-bit
        buffer.writeInt16LE(sample, i * 2);
    }
    
    return buffer;
}

/**
 * Creates audio resource with effects applied
 * @param {string|Buffer} audioSource - Audio file path or buffer
 * @param {string} effectType - Type of effect to apply
 * @param {Object} options - Effect options
 * @returns {AudioResource} Discord.js audio resource
 */
function createAudioResourceWithEffects(audioSource, effectType = "none", options = {}) {
    let audioBuffer;
    
    if (typeof audioSource === "string") {
        // For now, create placeholder audio
        audioBuffer = createTone(440, 2000);
    } else {
        audioBuffer = audioSource;
    }
    
    let processedBuffer;
    
    switch (effectType.toLowerCase()) {
        case "ghost":
            processedBuffer = applyGhostProtocolEffects(audioBuffer);
            break;
        case "glitch":
            processedBuffer = applyGlitchStormEffects(audioBuffer);
            break;
        case "echo":
            processedBuffer = applyEcho(audioBuffer, options.delay || 200, options.decay || 0.5);
            break;
        case "pitch":
            processedBuffer = applyPitchShift(audioBuffer, options.pitch || 0.7);
            break;
        case "reverse":
            processedBuffer = applyReverse(audioBuffer);
            break;
        case "static":
            processedBuffer = applyStaticNoise(audioBuffer, options.noiseLevel || 0.3);
            break;
        default:
            processedBuffer = audioBuffer;
    }
    
    const audioStream = Readable.from(processedBuffer);
    return createAudioResource(audioStream, {
        inlineVolume: true,
        inputType: "raw"
    });
}

/**
 * Creates ghost protocol audio (reverse speech with echo and distortion)
 * @param {string} message - Text message to convert to ghost speech
 * @returns {AudioResource} Ghost protocol audio resource
 */
function createGhostProtocolAudio(message = "You are being watched") {
    // Convert message to morse-like tones for ghost effect
    const baseTone = createTone(220, 3000); // Low frequency for creepy effect
    const ghostBuffer = applyGhostProtocolEffects(baseTone);
    
    return createAudioResourceWithEffects(ghostBuffer, "none");
}

/**
 * Creates nuclear alert audio (high-pitched alarm with static)
 * @returns {AudioResource} Nuclear alert audio resource
 */
function createNuclearAlertAudio() {
    const alarmTone = createTone(800, 500); // High-pitched alarm
    const processed = applyEcho(alarmTone, 100, 0.7);
    const final = applyStaticNoise(processed, 0.3);
    
    return createAudioResourceWithEffects(final, "none");
}

/**
 * Creates siren audio (alternating tones)
 * @returns {AudioResource} Siren audio resource
 */
function createSirenAudio() {
    const sirenBuffer = Buffer.concat([
        createTone(600, 500),
        createTone(800, 500),
        createTone(600, 500),
        createTone(800, 500)
    ]);
    
    return createAudioResourceWithEffects(sirenBuffer, "none");
}

module.exports = {
    // Effect functions
    applyPitchShift,
    applyEcho,
    applyReverse,
    applyStaticNoise,
    applyGhostProtocolEffects,
    applyGlitchStormEffects,
    
    // Audio creation functions
    createSilentBuffer,
    createTone,
    createAudioResourceWithEffects,
    createGhostProtocolAudio,
    createNuclearAlertAudio,
    createSirenAudio
};