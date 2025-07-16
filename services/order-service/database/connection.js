const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DBSOURCE = path.join(__dirname, 'orders.db');

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error('Erro ao conectar com o banco de pedidos.', err.message);
        throw err;
    }

    console.log('Conectado ao banco de pedidos');

    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customerName TEXT NOT NULL,
            items TEXT NOT NULL,
            total REAL NOT NULL,
            createdAt TEXT NOT NULL
        )    
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela orders', err.message);
        } else {
            console.log('Tabela orders pronta.');
        }
    }); 
});

module.exports = db;