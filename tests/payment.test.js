const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const Loan = require('../src/models/loan');
const Payment = require('../src/models/payment');
const sequelize = require('../src/config/database');
const jwt = require('jsonwebtoken');

describe('Payment Processing Tests', () => {
  let token;
  let userId;
  let loanId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    // Create test user
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    userId = user.id;
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    // Create test loan
    const loan = await Loan.create({
      user_id: userId,
      amount: 5000,
      purpose: 'Home Renovation',
      duration: 12,
      status: 'Approved',
      remaining_balance: 5000
    });
    loanId = loan.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await Payment.destroy({ where: {} });
  });

  test('Should process loan payment successfully', async () => {
    const response = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        loan_id: loanId,
        amount_paid: 1000
      });

    expect(response.status).toBe(201);
    expect(response.body.payment).toHaveProperty('amount_paid', 1000);
    expect(response.body.updatedLoan).toHaveProperty('remaining_balance', 4000);
  });

  test('Should retrieve payment history for a loan with pagination', async () => {
    // Create multiple test payments
    for (let i = 0; i < 10; i++) {
      await Payment.create({
        loan_id: loanId,
        amount_paid: 1000 + i * 100,
        payment_date: new Date()
      });
    }

    const response = await request(app)
      .get(`/api/loans/${loanId}/payments?page=1&limit=5`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(10);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.currentPage).toBe('1');
    expect(response.body.payments.length).toBe(5);
  });

  test('Should retrieve payment history on second page', async () => {
    const response = await request(app)
      .get(`/api/loans/${loanId}/payments?page=2&limit=5`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.currentPage).toBe('2');
    expect(response.body.payments.length).toBe(5);
  });
}); 