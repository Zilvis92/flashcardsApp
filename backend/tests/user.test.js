const request = require('supertest');
const express = require('express');
const User = require('../models/User');
const userRoutes = require('../routes/userRoutes');
const { errorHandler } = require('../middleware/errorMiddleware');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use(errorHandler);

require('./setup'); // We use the same DB setup

describe('User Auth Integration Tests', () => {
  
  const testUser = {
    username: 'tester',
    email: 'tester@example.com',
    password: 'Password123!'
  };

  describe('POST /api/users/register', () => {
    it('should register a new user and return a token', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.username).toBe(testUser.username);
      expect(res.body).not.toHaveProperty('password'); // Security: never return password
    });

    it('should hash the password in the database', async () => {
      await request(app)
        .post('/api/users/register')
        .send(testUser);

      const userInDb = await User.findOne({ email: testUser.email });
      
      // Check if the password in the database is not equal to "Password123!"
      expect(userInDb.password).not.toBe(testUser.password);
      // Check if it's a bcrypt hash (usually starts with $2a$ or $2b$)
      expect(userInDb.password).toMatch(/^\$2[ayb]\$.+/);
    });

    it('should not allow duplicate email registration', async () => {
      // Register first
      await User.create(testUser);

      // Try to register again with the same email
      const res = await request(app)
        .post('/api/users/register')
        .send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      // Before each login test, we create a user in the DB
      await request(app).post('/api/users/register').send(testUser);
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should fail login with wrong password', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain('Invalid');
    });

    it('should fail login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        });

      expect(res.statusCode).toBe(401);
    });
  });
});