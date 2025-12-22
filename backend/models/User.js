const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { // Hash'intas slaptažodis
    type: String,
    required: true
  },
  createdDecks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck'
  }],
  progress: [{
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card',
    },
    learned: {
      type: Boolean,
      default: false
    },
    lastStudied: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Metodas slaptažodžio tikrinimui (naudojamas prisijungiant)
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Automatinis slaptažodžio užšifravimas prieš išsaugojimą
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);