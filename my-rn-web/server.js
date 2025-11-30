// my-rn-web/server.js
const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

// Folder where Expo web export will be generated
const publicPath = path.join(__dirname, "web-build");

// Serve static files (JS, CSS, images, etc.)
app.use(express.static(publicPath));

// For any route, return index.html (SPA routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(port, () => {
  console.log(`CampusBuddy web listening on port ${port}`);
});
