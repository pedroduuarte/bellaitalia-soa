const express = require('express');
const cors = require('cors');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', orderRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Order-service rodando na porta ${PORT}`);
});