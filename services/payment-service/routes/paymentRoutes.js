const express = require('express');
const router = express.Router();
const { processPayment, getPaymentStatus } = require('../controller/paymentController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/process', authenticateToken, processPayment);      
router.get('/status/:id', authenticateToken, getPaymentStatus);   

module.exports = router;