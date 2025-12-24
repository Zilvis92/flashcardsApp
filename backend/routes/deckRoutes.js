const express = require('express');
const router = express.Router();
const { getDecks, createDeck, getDeckById } = require('../controllers/deckController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getDecks).post(protect, createDeck);
router.route('/:id').get(protect, getDeckById);

module.exports = router;
