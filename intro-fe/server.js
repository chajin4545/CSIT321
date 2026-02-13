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
    
    // Connect to MongoDB
    connectDB();
}

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes (if backend exists)
if (fs.existsSync(path.join(backendPath, 'routes', 'authRoutes.js'))) {
    console.log("Mounting API Routes from:", backendPath);
    const authRoutes = require(path.join(backendPath, 'routes', 'authRoutes'));
    const chatRoutes = require(path.join(backendPath, 'routes', 'chatRoutes'));
    const schoolAdminRoutes = require(path.join(backendPath, 'routes', 'schoolAdminRoutes'));
    const sysAdminRoutes = require(path.join(backendPath, 'routes', 'sysAdminRoutes'));
    const professorRoutes = require(path.join(backendPath, 'routes', 'professorRoutes'));

    app.use('/api/auth', authRoutes);
    app.use('/api/chat', chatRoutes);
    app.use('/api/school-admin', schoolAdminRoutes);
    app.use('/api/sys-admin', sysAdminRoutes);
    app.use('/api/professor', professorRoutes);
    
    // Serve uploaded files if directory exists
    const uploadsPath = path.join(backendPath, 'uploads');
    if (fs.existsSync(uploadsPath)) {
        app.use('/uploads', express.static(uploadsPath));
    }
    
    console.log("Full API Routes mounted successfully");
}

// Global error handler for API routes
app.use('/api', (err, req, res, next) => {
  console.error('API Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

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
