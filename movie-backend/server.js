require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Connect MongoDB
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ DB connection error:", err));

// Schema
const movieSchema = new mongoose.Schema({
  poster: String,
  quality: String,
  language: String,
  genres: [String],
  title: String,
  year: Number,
  trailer: String,
  subtitle: String,
  link1080: String,
  link720: String,
  description: String,
});
const Movie = mongoose.model("Movie", movieSchema);

// POST route
app.post("/add-movie", async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(200).send("Movie saved successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving movie");
  }
});

// GET route
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).send('Error fetching movies');
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', message: 'Backend API working fine!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
