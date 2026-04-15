const express = require('express');
const StandaloneWebServer = require('./web-server');

// Create the web server instance
const server = new StandaloneWebServer();

// Export for Vercel serverless functions
module.exports = (req, res) => {
    // Use the existing app instance
    return server.app(req, res);
};