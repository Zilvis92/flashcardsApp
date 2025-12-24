const express = require('express');
const router = express.Router();
const { addCard, deleteCard } = require('../controllers/cardController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addCard);
router.delete('/:id', protect, deleteCard);

module.exports = router;