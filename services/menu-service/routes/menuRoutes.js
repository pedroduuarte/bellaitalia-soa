const express = require('express');
const router = express.Router();
const { obterCardapio } = require('../controller/menuController');

router.get('/', obterCardapio);
router.post('/', obterCardapio);

module.exports = router;