// Perri van den Berg (2025)

const express = require("express");
const path = require("path");

const app = express();
const PORT = 3001;

// Serve static files correctly
app.use(express.static(path.join(__dirname, "public_editor")));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
