const Payment = require('../models/payment');
const Loan = require('../models/loan');
const sequelize = require('../config/database');

const paymentController = {
  async makePayment(req, res) {
    const t = await sequelize.transaction();

    try {
      const { loan_id, amount_paid } = req.body;
      const loan = await Loan.findOne({
        where: {
          id: loan_id,
          user_id: req.user.id
        }
      });

      if (!loan) {
        return res.status(404).json({ message: 'Loan not found' });
      }

      if (loan.status !== 'Approved') {
        return res.status(400).json({ message: 'Can only make payments for approved loans' });
      }

      if (amount_paid > loan.remaining_balance) {
        return res.status(400).json({ message: 'Payment amount exceeds remaining balance' });
      }

      // Create payment record
      const payment = await Payment.create({
        loan_id,
        amount_paid,
        payment_date: new Date()
      }, { transaction: t });

      // Update loan balance
      loan.total_paid += amount_paid;
      loan.remaining_balance -= amount_paid;
      await loan.save({ transaction: t });

      await t.commit();

      res.status(201).json({
        message: 'Payment processed successfully',
        payment,
        updatedLoan: loan
      });
    } catch (error) {
      await t.rollback();
      res.status(400).json({ message: error.message });
    }
  },

  async getLoanPayments(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
      const offset = (page - 1) * limit;

      const payments = await Payment.findAndCountAll({
        where: { loan_id: req.params.id },
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        total: payments.count,
        totalPages: Math.ceil(payments.count / limit),
        currentPage: page,
        payments: payments.rows
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = paymentController; 