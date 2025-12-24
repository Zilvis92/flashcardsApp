const express = require('express');
const router = express.Router();
const { addCard, deleteCard, updateCardMastered } = require('../controllers/cardController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addCard);
router.put('/:id/mastered', protect, updateCardMastered);
router.delete('/:id', protect, deleteCard);

module.exports = router;