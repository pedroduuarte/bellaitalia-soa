const express = require('express');
const router = express.Router();
const {
  createDelivery,
  listDeliveries,
  getDelivery,
  updateStatus
} = require('../controller/deliveryController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, createDelivery);
router.get('/', authenticateToken, listDeliveries);
router.get('/:id', authenticateToken, getDelivery);
router.patch('/:id/status', authenticateToken, updateStatus);

module.exports = router;