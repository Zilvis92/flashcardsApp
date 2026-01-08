const express = require('express');
const router = express.Router();
const { addCard, deleteCard, updateCardMastered, updateCard } = require('../controllers/cardController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addCard);
router.put('/:id/mastered', protect, updateCardMastered);
router.put('/:id', protect, updateCard);
router.delete('/:id', protect, deleteCard);

module.exports = router;