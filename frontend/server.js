// frontend/server.js
const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

// Where Expo exports the web build
const publicPath = path.join(__dirname, "dist");

// Serve static files
app.use(express.static(publicPath));

// Fallback route for SPA (no "*" pattern)
app.use((req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(port, () => {
  console.log(`CampusBuddy web listening on port ${port}`);
});
