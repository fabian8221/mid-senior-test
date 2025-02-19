const Loan = require('../models/loan');
const Payment = require('../models/payment');

const loanController = {
  async create(req, res) {
    try {
      const { amount, purpose, duration } = req.body;
      const loan = await Loan.create({
        user_id: req.user.id,
        amount,
        purpose,
        duration,
        remaining_balance: amount
      });

      res.status(201).json({
        message: 'Loan application submitted successfully',
        loan
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getAllUserLoans(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
      const offset = (page - 1) * limit;

      const loans = await Loan.findAndCountAll({
        where: { user_id: req.user.id },
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        total: loans.count,
        totalPages: Math.ceil(loans.count / limit),
        currentPage: page,
        loans: loans.rows
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getLoanById(req, res) {
    try {
      const loan = await Loan.findOne({
        where: {
          id: req.params.id,
          user_id: req.user.id
        }
      });

      if (!loan) {
        return res.status(404).json({ message: 'Loan not found' });
      }

      res.json(loan);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async updateLoanStatus(req, res) {
    try {
      const { status } = req.body;
      const loan = await Loan.findByPk(req.params.id);

      if (!loan) {
        return res.status(404).json({ message: 'Loan not found' });
      }

      if (!['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      loan.status = status;
      await loan.save();

      res.json({
        message: 'Loan status updated successfully',
        loan
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = loanController; 