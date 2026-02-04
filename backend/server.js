// Entry point for the backend server
const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); // Load env vars immediately

const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const schoolAdminRoutes = require('./routes/schoolAdminRoutes');

connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/school-admin', schoolAdminRoutes);

app.get('/', (req, res) => {
  res.send('Campus Buddy API is running...');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
