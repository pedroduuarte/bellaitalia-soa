const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// endpoint API menu-service
app.use('/api/cardapio', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true
}));

// endoint API order-service
app.use('/api/order', createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true
}));

// endpoint delivery-service
app.use('/api/delivery', createProxyMiddleware({
    target: 'http://localhost:3004',
    changeOrigin: true
}));

// endpoint auth-service
app.use('/api/auth', createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,

})) 

// endpoint payment-service
app.use('/api/payment', createProxyMiddleware({
    target: 'http://localhost:3005',
    changeOrigin: true
}))

// arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());

// rota para página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

// rota para página de cardápio
app.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/menu.html'));
});

// rota para página de pedido
app.get('/pedido', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/pedido.html'));
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Frontend rodando em http://localhost:${PORT}`);
});