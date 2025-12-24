const express = require('express');
const router = express.Router();
const { 
    getDecks, 
    createDeck, 
    getDeckById, 
    updateDeck, 
    deleteDeck 
} = require('../controllers/deckController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getDecks)
    .post(protect, createDeck);
router.route('/:id')
    .get(protect, getDeckById)
    .put(protect, updateDeck)
    .delete(protect, deleteDeck);

module.exports = router;
