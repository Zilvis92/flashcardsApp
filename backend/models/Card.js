const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  deck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
    required: true
  },
  front_side: {
    type: String,
    required: true,
    trim: true
  },
  back_side: {
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

module.exports = mongoose.model('Card', cardSchema);