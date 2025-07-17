const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());

//index
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

// endpoint API menu
app.get('/api/cardapio', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3001/api/cardapio');
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar cardápio' });
    }
});

app.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/menu.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Frontend rodando em http://localhost:${PORT}`);
});