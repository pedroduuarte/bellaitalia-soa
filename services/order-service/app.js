const express = require('express');
const cors = require('cors');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['POST', 'GET']
}));
app.use(express.json());

app.use('/api/order', orderRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Order-service rodando na porta ${PORT}`);
});