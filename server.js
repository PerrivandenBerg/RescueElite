// Perri van den Berg (2025)

const express = require('express');
const os = require('os');
const path = require('path');

const app = express();
const PORT = 4000;
const HOST = '0.0.0.0';

// Load the files in the folder.
app.use(express.static(path.join(__dirname, 'public')));

// Get local network IP.
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
        for (const details of iface) {
            if (details.family === 'IPv4' && !details.internal) {
                return details.address;
            }
        }
    }
    return 'localhost';
}

// Start server.
app.listen(PORT, HOST, () => {
    console.log(`Server running on:`);
    console.log(`- Local:   http://localhost:${PORT}`);
    console.log(`- Network: http://${getLocalIP()}:${PORT}`);
});
