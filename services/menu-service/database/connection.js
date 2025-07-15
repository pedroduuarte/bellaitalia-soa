const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DBSOURCE = path.join(__dirname, 'bella-italia.db');

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.log('Erro ao conectar SQLite: ', err.message);
        throw err;
    }
    console.log('Conectado ao banco SQLite');

    const createPizzasTable = `
        CREATE TABLE IF NOT EXISTS cardapio (
            tipo TEXT PRIMARY KEY,
            id TEXT,
            titulo TEXT,
            img TEXT,
            descricao TEXT,
            valor TEXT
        )`;

    db.run(createPizzasTable, (err) => {
        if (err) {
            console.error('Erro ao criar tabela pizzas: ', err.message);
        } else {
            console.log('Tabela pizzas criada');
        }
    });
});

module.exports = db;