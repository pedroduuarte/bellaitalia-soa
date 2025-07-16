const db = require('../database/connection')

const createDelivery = ({ id, rua, bairro, numero, taxaEntrega, tempoEntrega, status }) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO delivery (id, rua, bairro, numero, taxaEntrega, tempoEntrega, status) VALUES (?,?,?,?,?,?,?)`;
        db.run(query,
            [id, rua, bairro, numero, taxaEntrega, tempoEntrega, status],
            function (err) {
                if (err) return reject(err);
                resolve(this.lastID);
            });
    });
};

const listDeliveriesByStatus = (status) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM delivery WHERE status = ?`;
        db.all(query, [status], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

const listDeliveries = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM delivery`;
        db.all(query, [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

const findDeliveryById = (id) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM delivery WHERE id = ?";
        db.get(query, [id], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};

const updateDeliveryStatus = (id, status) => {
    return new Promise((resolve, reject) => {
        const query = "UPDATE delivery SET status = ? WHERE id = ?";
        db.run(query, [status, id], function (err) {
            if (err) return reject(err);
            resolve({ id, status });
        });
    });
};

module.exports = {
    createDelivery,
    listDeliveriesByStatus,
    listDeliveries,
    findDeliveryById,
    updateDeliveryStatus
}