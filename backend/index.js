const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Placeholder routes
app.get('/', (req, res) => {
  res.send('Movies API is running');
});

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// TODO: Add auth and movies routes

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  }); 