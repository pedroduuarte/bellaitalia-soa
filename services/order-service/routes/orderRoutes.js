const express = require('express');
const router = express.Router();
const { create, list } = require('../controller/orderContoller');
const authenticateToken = require('../middleware/authMiddleware');


router.post('/create', authenticateToken, create);
router.get('/list', list);

module.exports = router;