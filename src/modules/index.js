const GaslightingModule = require("./gaslighting");
const DeepfakeModule = require("./deepfake");
const SocialEngineeringModule = require("./socialEngineering");
const RealityDistortionModule = require("./realityDistortion");
const BehavioralControlModule = require("./behavioralControl");

function createModules({ config, logger }) {
    return {
        gaslighting: new GaslightingModule(config, logger),
        deepfake: new DeepfakeModule(config, logger),
        socialEngineering: new SocialEngineeringModule(config, logger),
        realityDistortion: new RealityDistortionModule(config, logger),
        behavioralControl: new BehavioralControlModule(config, logger)
    };
}

module.exports = {
    createModules
};
