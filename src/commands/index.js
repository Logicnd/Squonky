const { createCommands, deployCommands } = require("../services/commandRegistry");

function createCommandMap({ logger }) {
    return createCommands({ logger });
}

module.exports = createCommandMap;
module.exports.deployCommands = deployCommands;
