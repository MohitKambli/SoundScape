const express = require('express');
const dotenv = require('dotenv');
const spotifyRoutes = require('./routes/spotifyRoutes');
const connectDB = require('./config/dbConfig');

dotenv.config();

const app = express();
const PORT = process.env.PORT;
connectDB();

// Spotify routes
app.use('/api/spotify', spotifyRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Music App Backend!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
