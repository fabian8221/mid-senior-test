const express = require('express');
const loanController = require('../controllers/loanController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

router.use(auth);

router.post('/', loanController.create);
router.get('/', loanController.getAllUserLoans);
router.get('/:id', loanController.getLoanById);
router.patch('/:id/status', admin, loanController.updateLoanStatus);

module.exports = router; 