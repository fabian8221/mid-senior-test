const express = require('express');
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.post('/', paymentController.makePayment);
router.get('/loan/:id', paymentController.getLoanPayments);

module.exports = router; 