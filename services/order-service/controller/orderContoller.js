const Order = require('../models/orderModel');

const create = (req, res) => {
    const { customerName, itens, total } = req.body;

    if (!customerName || !itens || !total) {
        return res.status(400).json({message: 'Dados obrigatórios ausentes.'});
    } 

    if (!Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ message: 'Itens do pedido inválidos.' });
    }

    const order = {
        customerName,
        items: itens,
        total,
        createdAt: new Date().toISOString()
    };

    Order.createOrder(order, (err, id) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao registrar pedido.' });
        }

        res.status(201).json({ message: 'Pedido criado com sucesso.', orderId: id});
    });
};

const list = (req, res) => {
    Order.listOrders((err, orders) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao buscar pedidos.'});
        }

        res.status(200).json(orders);
    });
};

module.exports = {
    create,
    list
};