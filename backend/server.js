const express = require('express');
const dotenv = require('dotenv');
const spotifyRoutes = require('./routes/spotifyRoutes');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/dbConfig');
const cors = require('cors');
const authenticateToken = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
app.use(express.json()); // To parse JSON bodies

// Configure CORS to allow requests from your frontend
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests only from your frontend's origin
}));

// Connect to Database
connectDB();

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Route Example
app.use('/api/spotify', authenticateToken, spotifyRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the SoundScape!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
