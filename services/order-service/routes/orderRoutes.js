const express = require('express');
const router = express.Router();
const { create, list, getPizzaById, getOrderById } = require('../controller/orderController');
const authenticateToken = require('../middleware/authMiddleware');


router.post('/create', authenticateToken, create);
router.get('/list', list);
router.get('/:id', authenticateToken, getOrderById); 
router.get('/pizza/:id', getPizzaById);

module.exports = router;