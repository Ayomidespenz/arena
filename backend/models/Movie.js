const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  genre: { type: String },
  rating: { type: Number, min: 0, max: 10 },
  posterUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema); 