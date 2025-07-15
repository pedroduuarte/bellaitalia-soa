const db = require('../database/connection');

const createPizza = ({ tipo, id, titulo, descricao, valor }, callback) => {
    const query = `INSERT INTO cardapio (tipo, id, titulo, descricao, valor) VALUES (?,?,?,?,?)`;
    db.run(query, [tipo, id, titulo, descricao, valor], function (err) {
        callback(err, this ? this.lastID : null);
    });
};

module.exports = {
    createPizza
};