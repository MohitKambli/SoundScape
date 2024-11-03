const express = require('express');
const dotenv = require('dotenv');
const spotifyRoutes = require('./routes/spotifyRoutes');
const connectDB = require('./config/dbConfig');
const cors = require('cors');

dotenv.config();

const app = express();

// Configure CORS to allow requests from your frontend
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests only from your frontend's origin
}));

app.use('/api/spotify', spotifyRoutes);

const PORT = process.env.PORT;
connectDB();

app.get('/', (req, res) => {
  res.send('Welcome to the Music App Backend!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
