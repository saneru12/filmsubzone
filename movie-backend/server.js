const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// ✅ MongoDB URL එක 
const uri = "mongodb+srv://saneruthisadara224:odRZrw54NKb4cuJD@cluster0.fv5fx3i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("DB connection error:", err));

// 🎬 Schema එක
const movieSchema = new mongoose.Schema({
  poster: String,
  quality: String,
  language: String,
  genres: String,
  title: String,
  year: Number,
  trailer: String,
  subtitle: String,
  link1080: String,
  link720: String,
  description: String,
});

const Movie = mongoose.model("Movie", movieSchema);

// 🛠️ POST route එක
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

app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).send('Error fetching movies');
  }
});require('dotenv').config();
const mongoURI = process.env.MONGODB_URI;



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
