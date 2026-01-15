const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Deck = require('../models/Deck');
const Card = require('../models/Card');
const cardRoutes = require('../routes/cardRoutes');
const { errorHandler } = require('../middleware/errorMiddleware');

const app = express();
app.use(express.json());
app.use('/api/cards', cardRoutes);
app.use(errorHandler);

require('./setup');

describe('Card API Integration Tests', () => {
  let user, token, deck;

  beforeEach(async () => {
    // 1. We prepare the user and token
    user = await User.create({
      username: 'cardtester',
      email: 'cards@test.com',
      password: 'password123'
    });
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // 2. We create a deck, which will have cards
    deck = await Deck.create({
      title: 'Test Deck',
      sourceLanguage: 'EN',
      targetLanguage: 'LT',
      author: user._id
    });
  });

  describe('POST /api/cards', () => {
    it('should add a new card to the deck and update cardCount', async () => {
      const cardData = {
        deckId: deck._id,
        front_side: 'Apple',
        back_side: 'Obuolys',
        hint: 'Fruit'
      };

      const res = await request(app)
        .post('/api/cards')
        .set('Authorization', `Bearer ${token}`)
        .send(cardData);

      expect(res.statusCode).toBe(201);
      expect(res.body.front_side).toBe('Apple');
      
      // We check if the Deck model updated the counter
      const updatedDeck = await Deck.findById(deck._id);
      expect(updatedDeck.cardCount).toBe(1);
      const cardIds = updatedDeck.cards.map(id => id.toString());
expect(cardIds).toContain(res.body._id);
    });

    it('should not allow adding a card to another users deck', async () => {
      const otherUser = await User.create({ username: 'other', email: 'o@o.com', password: '123' });
      const otherDeck = await Deck.create({
        title: 'Other Deck', sourceLanguage: 'EN', targetLanguage: 'LT', author: otherUser._id
      });

      const res = await request(app)
        .post('/api/cards')
        .set('Authorization', `Bearer ${token}`)
        .send({ deckId: otherDeck._id, front_side: 'Hack', back_side: 'Hack' });

      expect(res.statusCode).toBe(404); // Based on controller, it returns 404
    });
  });

  describe('PUT /api/cards/:id/mastered', () => {
    it('should toggle mastered status', async () => {
      const card = await Card.create({
        deck: deck._id,
        front_side: 'Dog',
        back_side: 'Šuo',
        mastered: false
      });

      const res = await request(app)
        .put(`/api/cards/${card._id}/mastered`)
        .set('Authorization', `Bearer ${token}`)
        .send({ mastered: true });

      expect(res.statusCode).toBe(200);
      expect(res.body.mastered).toBe(true);
    });
  });

  describe('DELETE /api/cards/:id', () => {
    it('should delete card and remove reference from deck', async () => {
      const card = await Card.create({
        deck: deck._id,
        front_side: 'Delete Me',
        back_side: 'Ištrink mane'
      });
      
      // Manually add card to deck (since we created it via model, not API)
      deck.cards.push(card._id);
      deck.cardCount = 1;
      await deck.save();

      const res = await request(app)
        .delete(`/api/cards/${card._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      
      // Check DB
      const cardInDb = await Card.findById(card._id);
      expect(cardInDb).toBeNull();

      const updatedDeck = await Deck.findById(deck._id);
      expect(updatedDeck.cardCount).toBe(0);
      expect(updatedDeck.cards).not.toContain(card._id.toString());
    });
  });
});