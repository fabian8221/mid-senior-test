const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const Loan = require('../src/models/loan');
const sequelize = require('../src/config/database');
const jwt = require('jsonwebtoken');

describe('Loan Management Tests', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    // Create a test user and generate token
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    userId = user.id;
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await Loan.destroy({ where: {} });
  });

  test('Should create a new loan application', async () => {
    const response = await request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 5000,
        purpose: 'Home Renovation',
        duration: 12
      });

    expect(response.status).toBe(201);
    expect(response.body.loan).toHaveProperty('amount', 5000);
    expect(response.body.loan).toHaveProperty('status', 'Pending');
  });

  test('Should retrieve user loans with pagination', async () => {
    // Create multiple test loans
    for (let i = 0; i < 15; i++) {
      await Loan.create({
        user_id: userId,
        amount: 5000 + i * 1000,
        purpose: 'Home Renovation',
        duration: 12,
        remaining_balance: 5000 + i * 1000
      });
    }

    const response = await request(app)
      .get('/api/loans?page=1&limit=5')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(15);
    expect(response.body.totalPages).toBe(3);
    expect(response.body.currentPage).toBe('1');
    expect(response.body.loans.length).toBe(5);
  });

  test('Should retrieve user loans on second page', async () => {
    const response = await request(app)
      .get('/api/loans?page=2&limit=5')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.currentPage).toBe('2');
    expect(response.body.loans.length).toBe(5);
  });
}); 