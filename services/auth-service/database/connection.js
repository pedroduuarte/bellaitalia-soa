const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DBSOURCE = path.join(__dirname, 'bella-italia.db');

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.log('Erro ao conectar SQLite: ', err.message);
        throw err;
    }
    console.log('Conectado ao banco SQLite');

    // tabela user
    const createUserTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`;

    db.run(createUserTable, (err) => {
        if (err) {
            console.error('Erro ao criar tabela users: ', err.message);
        } else {
            console.log('Tabela users criada');
        }
    });
});

module.exports = db;