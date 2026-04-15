const StandaloneWebServer = require('../web-server');

// Create and export the web server for Vercel
const server = new StandaloneWebServer();

// Export for Vercel serverless functions
module.exports = (req, res) => {
    // Handle the request using the standalone server
    server.app(req, res);
};