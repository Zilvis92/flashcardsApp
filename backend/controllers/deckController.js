const asyncHandler = require('express-async-handler');
const Deck = require('../models/Deck');

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

module.exports = {
    getDecks,
    createDeck,
    getDeckById
};