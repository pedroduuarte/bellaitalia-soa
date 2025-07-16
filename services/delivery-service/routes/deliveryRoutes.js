const express = require('express');
const router = express.Router();
const {
  createDelivery,
  listDeliveries,
  getDelivery,
  updateStatus
} = require('../controller/deliveryController');

router.post('/', createDelivery);
router.get('/', listDeliveries);
router.get('/:id', getDelivery);
router.patch('/:id/status', updateStatus);

module.exports = router;