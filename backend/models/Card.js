const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  deck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
    required: true
  },
  sideA: {
    type: String,
    required: true,
    trim: true
  },
  sideB: {
    type: String,
    required: true,
    trim: true
  },
  hint: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Card', CardSchema);