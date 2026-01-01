// frontend/server.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const cors = require("cors");

// Load env vars
dotenv.config();

// Try to connect to DB if backend config exists (Merged Deployment)
const backendPath = path.join(__dirname, 'backend');
if (fs.existsSync(path.join(backendPath, 'config', 'db.js'))) {
    console.log("Found backend module, initializing...");
    const connectDB = require(path.join(backendPath, 'config', 'db.js'));
    const authRoutes = require(path.join(backendPath, 'routes', 'authRoutes'));
    
    // Connect to MongoDB
    connectDB();
}

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// API Routes (if backend exists)
if (fs.existsSync(path.join(backendPath, 'routes', 'authRoutes.js'))) {
    const authRoutes = require(path.join(backendPath, 'routes', 'authRoutes'));
    app.use('/api/auth', authRoutes);
    console.log("API Routes mounted at /api/auth");
}

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

// Prototype SPA fallback
app.use('/campus-buddy-fe', (req, res) => {
  res.sendFile(path.join(publicPath, 'campus-buddy-fe', 'index.html'));
});

// Fallback route for SPA (no "*" pattern)
app.use((req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(port, () => {
  console.log(`CampusBuddy web listening on port ${port}`);
});
