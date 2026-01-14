const express = require('express');
const router = express.Router();
const { 
    getDecks, 
    createDeck, 
    getDeckById, 
    updateDeck, 
    deleteDeck,
    resetDeckProgress 
} = require('../controllers/deckController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getDecks)
    .post(protect, createDeck);
router.route('/:id')
    .get(protect, getDeckById)
    .put(protect, updateDeck)
    .delete(protect, deleteDeck);

router.post('/:id/reset', protect, resetDeckProgress);

module.exports = router;
