const express = require('express');
const router = express.Router();
const axios = require('axios');
const Transaction = require('../models/Transaction');




router.get('/initialize', async (req, res) => {
  try {

    const response = await fetch('https://s3.amazonaws.com/roxiler.com/product_transaction.json');

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    await Transaction.insertMany(data);
    res.status(200).json({ message: 'Database initialized successfully!' });
  } catch (error) {
    console.error('Error initializing the database:', error);
    res.status(500).json({ message: 'Failed to initialize database', error: error.message });
  }
});




module.exports = router;
