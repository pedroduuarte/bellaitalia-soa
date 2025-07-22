const createPizza = require('../models/pizzaModel')

const obterCardapio = (req, res) => {
    if (req.method === 'GET') {
        res.json({
            message: "Cardápio obtido com sucesso (GET)",
            data: [
                { tipo: "PizzaTradicional", id: 1, titulo: "Margherita", descricao: "Molho de tomate, mussarela e manjericão", valor: "45.00" },
                { tipo: "PizzaTradicional", id: 2, titulo: "Calabresa", descricao: "Molho de tomate, mussarela, calabresa e cebola", valor: "50.00" },
                { tipo: "PizzaTradicional", id: 3, titulo: "Frango com Catupiry", descricao: "Molho de tomate, frango desfiado, catupiry e orégano.", valor: "45.00" },
                { tipo: "PizzaTradicional", id: 4, titulo: "Quatro Queijos", descricao: "Mussarela, parmesão, gorgonzola e provolone.", valor: "45.00" },
                { tipo: "PizzaTradicional", id: 5, titulo: "Portuguesa", descricao: "Mussarela, presunto, ovo, cebola, pimentão e azeitonas.", valor: "45.00" },
                { tipo: "PizzaTradicional", id: 6, titulo: "Pepperoni", descricao: "Molho de tomate, mussarela e pepperoni fatiado.", valor: "45.00" },
                { tipo: "PizzaTradicional", id: 7, titulo: "Bacon com Cheddar", descricao: "Molho de tomate, mussarela, bacon crocante e cheddar.", valor: "50.00" },
                { tipo: "PizzaTradicional", id: 8, titulo: "A Moda da Casa", descricao: "Mussarela, peito de frango desfiado, bacon e azeitonas.", valor: "55.00" },

                { tipo: "PizzaDoce", id: 9, titulo: "Chocolate com Morango", descricao: "Creme de chocolate, morangos frescos e chantilly.", valor: "40.00" },
                { tipo: "PizzaDoce", id: 10, titulo: "Banana com Canela", descricao: "Fatias de banana, açúcar, canela e cobertura de chocolate.", valor: "40.00" },
                { tipo: "PizzaDoce", id: 11, titulo: "Brigadeiro", descricao: "Creme de brigadeiro, granulado e bolinhas de brigadeiro.", valor: "40.00" },
                { tipo: "PizzaDoce", id: 12, titulo: "Romeu e Julieta", descricao: "Mussarela, goiabada, açúcar mascavo.", valor: "45.00" },

                { tipo: "Bebida", id: 13, titulo: "Água", descricao: "Garrafa de água sem gás de 500ml.", valor: "3.00" },
                { tipo: "Bebida", id: 14, titulo: "Água com Gás", descricao: "Garrafa de água com gás de 500ml.", valor: "4.00" },

                { tipo: "Bebida", id: 15, titulo: "Coca-Cola Lata", descricao: "Lata de Coca-Cola 350ml.", valor: "5.00" },
                { tipo: "Bebida", id: 16, titulo: "Coca-Cola 1L", descricao: "Garrafa de Coca-Cola 1 litro.", valor: "8.00" },
                { tipo: "Bebida", id: 17, titulo: "Coca-Cola Zero Lata", descricao: "Lata de Coca-Cola Zero 350ml.", valor: "5.00" },

                { tipo: "Bebida", id: 18, titulo: "Guaraná Lata", descricao: "Lata de Guaraná 350ml.", valor: "5.00" },
                { tipo: "Bebida", id: 19, titulo: "Guaraná 1L", descricao: "Garrafa de Guaraná 1 litro.", valor: "7.50" },
                { tipo: "Bebida", id: 20, titulo: "Guaraná Zero Lata", descricao: "Lata de Guaraná Zero 350ml.", valor: "5.00" },

                { tipo: "Bebida", id: 21, titulo: "Sprite Lata", descricao: "Lata de Sprite 350ml.", valor: "5.00" },
                { tipo: "Bebida", id: 22, titulo: "Sprite 1L", descricao: "Garrafa de Sprite 1 litro.", valor: "7.50" },
                { tipo: "Bebida", id: 23, titulo: "Sprite Zero Lata", descricao: "Lata de Sprite Zero 350ml.", valor: "5.00" }

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