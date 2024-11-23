const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  sold: Boolean,
  dateOfSale: Date,
});
// asb

module.exports = mongoose.model("Transaction", TransactionSchema);
