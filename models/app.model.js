const fs = require('fs/promises');
const path = require('path')
const db = require("../db/connection");
const format = require("pg-format");

exports.selectTopics = () => {
    return db.query(`
        SELECT * FROM topics
    `)
}

exports.checkEndpoints = () => {
    const endpointsFilePath = path.join(__dirname, '../endpoints.json');

    return fs.readFile(endpointsFilePath, 'utf8')
      .then(data => {
        const endpointsDocs = JSON.parse(data);
        return endpointsDocs
      })
      .catch(error => {
        console.error(error);
      });
}

exports.getArticleById = (id) => {
    return db.query(`
        SELECT * FROM articles
        WHERE article_id = $1
    `, [id])
}