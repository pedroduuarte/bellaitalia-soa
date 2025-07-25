const deliveryService = require('../models/deliveryModel');

const createDelivery = async (req, res) => {
    try {
         console.log('Request Body:', req.body); // Para debug
    
        if (!req.body) {
            return res.status(400).json({ error: "Request body is missing" });
        }

        const { id, rua, bairro, numero } = req.body;
        
        if (!id || !rua || !bairro || !numero) {
            return res.status(400).json({ 
                error: "Dados incompletos",
                required: ["id", "rua", "bairro", "numero"]
            });
        }
        const delivery = await deliveryService.createDelivery(req.body);
        res.status(201).json(delivery);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const delivery = await deliveryService.updateDeliveryStatus(id, status);
        res.json(delivery);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getDelivery = async (req, res) => {
    try {
        const { id } = req.params;
        const delivery = await deliveryService.findDeliveryById(id);

        if (!delivery) {
            return res.status(404).json({ error: 'Delivery não encontrado' });
        }

        res.json(delivery);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const listDeliveries = async (req, res) => {
    try {
        const { status } = req.query;
        const deliveries = status
            ? await deliveryService.listDeliveriesByStatus(status)
            : await deliveryService.listDeliveries();
        res.json(deliveries);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createDelivery,
    updateStatus,
    getDelivery,
    listDeliveries
};