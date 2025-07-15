const express = require('express')
const cors = require('cors')
require('dotenv').config();

const menuRoutes = require('./routes/menuRoutes')

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/cardapio', menuRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Menu Service rodando na porta ${PORT}`)
})