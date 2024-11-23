const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const initializeRoute = require('./routes/initialize');
const transactionRoutes = require('./routes/transactions');





const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.use('/api', initializeRoute);
app.use('/api', transactionRoutes);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/mernChallenge', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
