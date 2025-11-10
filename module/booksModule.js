const mongoose = require("mongoose");
const booksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  publishedYear: {
    type: Number
  },
  genre: {
    type: String
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
})
module.exports = mongoose.model('Book', booksSchema);