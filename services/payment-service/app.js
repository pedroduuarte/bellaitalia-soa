const express = require('express');
const cors = require('cors');
require('dotenv').config();

const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET']
}));
app.use(express.json());

app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Payment-service rodando na porta ${PORT}`);
});