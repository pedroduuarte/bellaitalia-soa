exports.processPayment = (req, res) => {
    const { orderId, paymentMethod, amount } = req.body;
    console.log(`Pagamento de R$${amount} processado para pedido ${orderId} via ${paymentMethod}`);
    
    res.status(200).json({
        message: 'Pagamento processado com sucesso!',
        status: 'success',
        paymentId: Math.floor(Math.random() * 100000),
    });
};

exports.getPaymentStatus = (req, res) => {
    const paymentId = req.params.id;

    res.status(200).json({
        paymentId,
        status: 'success',
        message: 'Pagamento confirmado',
    });
};