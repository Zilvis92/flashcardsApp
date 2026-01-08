const asyncHandler = require('express-async-handler');
const Card = require('../models/Card');
const Deck = require('../models/Deck');

// @desc get all cards
// @route GET /api/decks/:id/cards
// @access Private
const getCardsByDeck = asyncHandler(async (req, res) => {
    const deck = await Deck.findById(req.params.deckId);

    if (!deck || deck.author.toString() !== req.user._id.toString()) {
        res.status(404);
        throw new Error('Deck not found');
    }

    const cards = await Card.find({ deck: req.params.deckId });
    res.json(cards);
});

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
        hint,
        mastered: false
    });

    deck.cards.push(card._id);
    deck.cardCount = deck.cards.length;
    await deck.save();

    res.status(201).json(card);
});

// @desc update a card
// @route PUT /api/decks/:id/mastered
// @access Private
const updateCardMastered = asyncHandler(async (req, res) => {
    const card = await Card.findById(req.params.id);

    if (!card) {
        res.status(404);
        throw new Error('Card not found');
    }

    const deck = await Deck.findById(card.deck);
    if (!deck || deck.author.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }

    // Pakeičiame statusą
    card.mastered = req.body.mastered !== undefined ? req.body.mastered : !card.mastered;
    const updatedCard = await card.save();

    res.json(updatedCard);
});

// @desc    Update a card (full edit)
// @route   PUT /api/cards/:id
// @access  Private
const updateCard = asyncHandler(async (req, res) => {
    const { front_side, back_side, hint } = req.body;
    const card = await Card.findById(req.params.id);

    if (!card) {
        res.status(404);
        throw new Error('Card not found');
    }

    const deck = await Deck.findById(card.deck);
    if (!deck || deck.author.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }

    // Atnaujiname laukus
    card.front_side = front_side || card.front_side;
    card.back_side = back_side || card.back_side;
    card.hint = hint !== undefined ? hint : card.hint;

    const updatedCard = await card.save();
    res.json(updatedCard);
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
    if (!deck || deck.author.toString() !== req.user._id.toString()) {
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
    getCardsByDeck,
    addCard,
    updateCardMastered,
    updateCard,
    deleteCard
};
    