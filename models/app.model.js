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
}

exports.selectArticleById = (id) => {
    return db.query(`
        SELECT * FROM articles
        WHERE article_id = $1
    `, [id])
        .then((result) => {
            if (!result.rows.length) {
                return Promise.reject({ status: 404, msg: 'Article does not exist' })
            }
            return result
        });
}

exports.findAllArticles = () => {
    return db.query(`
    SELECT articles.article_id,articles.title,articles.topic,articles.author,articles.body,articles.created_at,articles.votes,articles.article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id,articles.title,articles.topic,articles.author,articles.body,articles.created_at,articles.votes,articles.article_img_url
    ORDER BY created_at DESC;
    `)
    .then(({ rows }) => {
        return rows
    })
}

exports.findAllCommentsFromArticle = (id) => {
    return db.query(`
        SELECT * FROM comments
        WHERE article_id = $1;
    `,[id])
    .then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: 'Article does not exist' })
        }
    
        return rows
    })
}
