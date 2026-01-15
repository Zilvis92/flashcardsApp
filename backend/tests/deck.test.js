const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Deck = require('../models/Deck');
const deckRoutes = require('../routes/deckRoutes');
const { errorHandler } = require('../middleware/errorMiddleware');

// Create a mini app for tests (isolated from server.js listen() part)
const app = express();
app.use(express.json());

// Mock middleware, so we don't need to fill in real auth every time (or use real one)
app.use('/api/decks', deckRoutes);
app.use(errorHandler);

require('./setup'); // Import DB setup

describe('Deck API Integration Tests', () => {
  let user, token;

  beforeEach(async () => {
    // We create a test user
    user = await User.create({
      username: 'testuser',
      email: 'test@gmail.com',
      password: 'password123'
    });

    // Generate a token
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
  });

  describe('POST /api/decks', () => {
    it('should create a new deck when user is authorized', async () => {
      const deckData = {
        title: 'Spanish Verbs',
        description: 'Common verbs',
        sourceLanguage: 'English',
        targetLanguage: 'Spanish'
      };

      const res = await request(app)
        .post('/api/decks')
        .set('Authorization', `Bearer ${token}`)
        .send(deckData);

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe('Spanish Verbs');
      expect(res.body.author.toString()).toBe(user._id.toString());
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/decks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Missing Languages' });

      expect(res.statusCode).toBe(400);
    });

    it('should return 401 if no token provided', async () => {
      const res = await request(app).post('/api/decks').send({});
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/decks/:id', () => {
    it('should fetch a specific deck with populated cards', async () => {
      const deck = await Deck.create({
        title: 'My Deck',
        sourceLanguage: 'LT',
        targetLanguage: 'EN',
        author: user._id
      });

      const res = await request(app)
        .get(`/api/decks/${deck._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(deck._id.toString());
      expect(Array.isArray(res.body.cards)).toBe(true);
    });

    it('should return 404 if deck belongs to another user', async () => {
      const otherUser = await User.create({
        username: 'other', email: 'other@gmail.com', password: '123'
      });
      const otherDeck = await Deck.create({
        title: 'Secret Deck', sourceLanguage: 'LT', targetLanguage: 'EN', author: otherUser._id
      });

      const res = await request(app)
        .get(`/api/decks/${otherDeck._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });
});