// frontend/server.js
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 8080;

// Where Expo exports the web build. Prefer 'dist' (modern output),
// fall back to 'web-build' (older Expo versions), and allow overriding
// with the STATIC_DIR environment variable if needed.
let staticDir = process.env.STATIC_DIR;
if (!staticDir) {
  if (fs.existsSync(path.join(__dirname, 'dist'))) {
    staticDir = 'dist';
  } else if (fs.existsSync(path.join(__dirname, 'web-build'))) {
    staticDir = 'web-build';
  } else {
    // Default to 'dist' to match your environment; if missing, server
    // will still attempt to serve from dist and will log a clear error.
    staticDir = 'dist';
  }
}
const publicPath = path.join(__dirname, staticDir);

// Serve static files
app.use(express.static(publicPath));

// Fallback route for SPA (no "*" pattern)
app.use((req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(port, () => {
  console.log(`CampusBuddy web listening on port ${port}`);
});
