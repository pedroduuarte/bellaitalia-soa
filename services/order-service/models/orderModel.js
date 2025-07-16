const db = require('../database/connection');

const createOrder = (order, callback) => {
    const { customerName, items, total, createdAt } = order;
    const query = `INSERT INTO orders (customerName, items, total, createdAt) VALUES (?, ?, ?, ?)`;

    db.run(query, [customerName, JSON.stringify(items), total, createdAt], function(err) {
        callback(err, this?.lastID);
    });
};

const listOrders = (callback) => {
    const query = `SELECT * FROM orders ORDER BY createdAt DESC`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return callback(err);
        }

        const formatted = rows.map(order => ({
            ...order,
            items: JSON.parse(order.items)
        }));
        callback(null, formatted);
    });
};

module.exports = {
    createOrder,
    listOrders
}