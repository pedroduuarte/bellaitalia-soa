const express = require('express');
const router = express.Router();
const { processPayment, getPaymentStatus } = require('../controller/paymentController');

router.post('/process', processPayment);      
router.get('/status/:id', getPaymentStatus);   

module.exports = router;