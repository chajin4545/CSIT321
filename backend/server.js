// Entry point for the backend server
const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); // Load env vars immediately

const cors = require('cors');
const multer = require('multer');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const schoolAdminRoutes = require('./routes/schoolAdminRoutes');
const sysAdminRoutes = require('./routes/sysAdminRoutes');
const professorRoutes = require('./routes/professorRoutes');

connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Multer configuration for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/school-admin', schoolAdminRoutes);
app.use('/api/sys-admin', sysAdminRoutes);
app.use('/api/professor', professorRoutes);

app.get('/', (req, res) => {
  res.send('Campus Buddy API is running...');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
