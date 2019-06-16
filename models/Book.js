var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true
  },
  comments: [[{ body: String, date: Date }]]
})

exports.Book = mongoose.model("Book", BookSchema);