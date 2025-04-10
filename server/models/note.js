const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true }, // Encrypted in backend
  key: { type: String }, // Optional encrypted key field
});

module.exports = mongoose.model('note', noteSchema);