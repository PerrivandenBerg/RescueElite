// Perri van den Berg (2025)

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

// Saves the game data of the user.
app.post('/save-game-data', (req, res) => {
    const data = req.body;  // Game data sent from the client.

    // Generate file path for storing data.
    const filePath = path.join(__dirname, 'game_data', `${data.sessionId}.json`);

    // Save the data as a JSON file (Overwrites exisiting files).
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error saving data:', err);
            return res.status(500).json({ message: 'Failed to save data' });
        }
        res.status(200).json({ message: 'Data saved successfully' });
    });
});

const PORT = 3000;
const HOST = '0.0.0.0';

// Load the files in the folder.
app.use(express.static(path.join(__dirname, 'public')));

// Start server.
app.listen(PORT, HOST, () => {
    console.log(`The server is running!`);
});
