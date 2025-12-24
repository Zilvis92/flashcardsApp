const asyncHandler = require('express-async-handler');
const Card = require('../models/Card');
const Deck = require('../models/Deck');

// @desc add a card to a deck
// @route POST /api/decks/:id/cards
// @access Private
const addCard = asyncHandler(async (req, res) => {
    const { deckId, front_side, back_side, hint } = req.body;

    const deck = await Deck.findById(deckId);
    if (!deck || deck.author.toString() !== req.user._id.toString()) {
        res.status(404);
        throw new Error('Deck not found');
    }

    const card = await Card.create({
        deck: deckId,
        front_side,
        back_side,
        hint
    });

    deck.cards.push(card._id);
    deck.cardCount = deck.cards.length;
    await deck.save();

    res.status(201).json(card);
});

// @desc delete a card
// @route DELETE /api/decks/:id/cards/:cardId
// @access Private

const deleteCard = asyncHandler(async (req, res) => {
    const card = await Card.findById(req.params.id);
    if (!card) {
        res.status(404);
        throw new Error('Card not found');
    }

    const deck = await Deck.findById(card.deck);
    if (deck.author.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }

    await card.deleteOne();

    deck.cards = deck.cards.filter(card => card.toString() !== req.params.id);
    deck.cardCount = deck.cards.length;
    await deck.save();

    res.json({ message: 'Card deleted' });
});

module.exports = {
    addCard,
    deleteCard
};
    