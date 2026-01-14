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
        throw new Error('Rinkinys nerastas');
    }

    if (deck.author.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Vartotojas neautorizuotas');
    }

    const updatedDeck = await Deck.findByIdAndUpdate(
        req.params.id,
        req.body, // Paima pasikeitusius laukus iš užklausos
        { new: true } // Grąžina jau atnaujintą objektą
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
        throw new Error('Rinkinys nerastas');
    }

    // Tikriname ar trina savininkas (tavo modelyje laukas yra 'author')
    if (deck.author.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Vartotojas neautorizuotas');
    }

    await deck.deleteOne();
    res.json({ message: 'Rinkinys ir informacija sėkmingai pašalinti' });
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

    // Atnaujiname visas korteles, kurios priklauso šiam rinkiniled
    await Card.updateMany(
        { deck: req.params.id },
        { $set: { mastered: false } }
    );

    // Grąžiname atnaujintą rinkinį su kortelėmis
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