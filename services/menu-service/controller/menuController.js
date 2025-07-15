const createPizza = require('../models/pizzaModel')

const obterCardapio = (req, res) => {
    if (req.method === 'GET') {
        res.json({
            message: "Cardápio obtido com sucesso (GET)",
            data: [
                { tipo: "PizzaTradicional", id: 1, titulo: "Margherita", descricao: "Molho de tomate, mussarela e manjericão", valor: "45.90" },
                { tipo: "PizzaTradicional", id: 2, titulo: "Calabresa", descricao: "Molho de tomate, mussarela e calabresa", valor: "50.00" }
            ]
        });
    } else if (req.method === 'POST') {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Corpo da requisição não fornecido ou vazio" });
        }

        const { tipo, id, titulo, descricao, valor } = req.body;

        res.json({
            message: "Pizza cadastrada com sucesso!",
            data: { tipo, id, titulo, descricao, valor }
        });
    }
};

module.exports = { obterCardapio };