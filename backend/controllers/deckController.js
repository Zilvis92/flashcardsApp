const asyncHandler = require('express-async-handler');
const Deck = require('../models/Deck');
const Card = require('../models/Card');
// @desc get all decks
// @route GET /api/decks
// @access Private
const getDecks = asyncHandler(async (req, res) => {
    const decks = await Deck.find({ author: req.user._id });
    res.json(decks);
});

// @desc create a deck
// @route POST /api/decks
// @access Private
const createDeck = asyncHandler(async (req, res) => {
    const { title, description, sourceLanguage, targetLanguage } = req.body;

    if (!title || !sourceLanguage || !targetLanguage) {
        res.status(400);
        throw new Error('Please add a title, source language and target language');
    }

    const deck = await Deck.create({
        title,
        description,
        sourceLanguage,
        targetLanguage,
        author: req.user._id
    });

    res.status(201).json(deck);
});

// @desc get one deck with all cards
// @route GET /api/decks/:id
// @access Private
const getDeckById = asyncHandler(async (req, res) => {
    const deck = await Deck.findById(req.params.id).populate('cards');

    if (!deck || deck.author.toString() !== req.user._id.toString()) {
        res.status(404);
        throw new Error('Deck not found');
    }

    res.json(deck);
});

// @desc update a deck
// @route PUT /api/decks/:id
// @access Private
const updateDeck = asyncHandler(async (req, res) => {
    const deck = await Deck.findById(req.params.id);

    if (!deck) {
        res.status(404);
        throw new Error('Collection not found');
    }

    if (deck.author.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedDeck = await Deck.findByIdAndUpdate(
        req.params.id,
        req.body, // Takes the changed fields from the query
        { new: true } // Returns the updated object
    ).populate('cards');

    res.json(updatedDeck);
});

// @desc delete a deck
// @route DELETE /api/decks/:id
// @access Private
const deleteDeck = asyncHandler(async (req, res) => {
    const deck = await Deck.findById(req.params.id);

    if (!deck) {
        res.status(404);
        throw new Error('Collection not found');
    }

    // We check whether the owner is deleting (in your model, the field is 'author')
    if (deck.author.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await deck.deleteOne();
    res.json({ message: 'Collection and information successfully deleted' });
});

// @desc    Reset all cards mastered status in a deck
// @route   POST /api/decks/:id/reset
// @access  Private
const resetDeckProgress = asyncHandler(async (req, res) => {
    const deck = await Deck.findById(req.params.id);

    if (!deck) {
        res.status(404);
        throw new Error('Deck not found');
    }

    if (deck.author.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }

    // Update all cards in the deck to not mastered
    await Card.updateMany(
        { deck: req.params.id },
        { $set: { mastered: false } }
    );

    // Return updated deck with cards
    const updatedDeck = await Deck.findById(req.params.id).populate('cards');
    res.json(updatedDeck);
});

module.exports = {
    getDecks,
    createDeck,
    getDeckById,
    updateDeck,
    deleteDeck,
    resetDeckProgress
};