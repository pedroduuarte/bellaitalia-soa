const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DBSOURCE = path.join(__dirname, 'delivery.db');

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.log('Erro ao conectar SQLite: ', err.message);
        throw err;
    }
    console.log('Conectado ao banco SQLite');

    const createDeliveryTable = `
        CREATE TABLE IF NOT EXISTS delivery (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        rua TEXT NOT NULL, 
        bairro TEXT NOT NULL, 
        numero TEXT NOT NULL, 
        taxaEntrega REAL NOT NULL, 
        tempoEntrega INTEGER NOT NULL, 
        status TEXT NOT NULL CHECK(status IN ('pendente', 'em preparação', 'a caminho', 'entregue', 'cancelado'))
        )`;

    db.run(createDeliveryTable, (err) => {
        if (err) {
            console.error('Erro ao criar tabela delivery: ', err.message);
        } else {
            console.log('Tabela delivery criada');
        }
    });
});

module.exports = db;