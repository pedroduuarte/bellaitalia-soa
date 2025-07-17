const express = require('express');
const cors = require('cors');
require('dotenv').config();

const deliveryRoutes = require('./routes/deliveryRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/delivery', deliveryRoutes);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Delivery service rodando na porta ${PORT}`);
});
