const db = require("../db/connection");
const format = require("pg-format");

exports.topicsFunc = () => {
    return db.query(`
        SELECT * FROM topics
    `)
}