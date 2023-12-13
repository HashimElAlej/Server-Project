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
        SELECT * FROM articles
        WHERE article_id = $1;
    `, [id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: 'Article does not exist' })
            }
            return rows
        })
        .then((rows) => {
            return db.query(`
        SELECT * FROM comments
        WHERE article_id = $1;
        `, [id])
        })
        .then(({ rows }) => {
            return rows
        })
}

exports.addCommentToArticle = (comment, id) => {
    return db.query(`
        INSERT INTO comments (body, author, article_id, votes, created_at)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `, [comment.body, comment.author, comment.article_id, comment.votes, comment.created_at])
        .then(({ rows }) => {
            if (id != comment.article_id) {
                return Promise.reject({ status: 404, msg: 'Article does not exist' })
            }
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: 'Article does not exist' })
            }
            return rows
        })
};

exports.updateVotes = (votes, id) => {
    return db.query(`
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2 RETURNING *
    `, [votes.inc_votes, id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: 'Article does not exist' })
            }
            return rows
        })
};

exports.findAllUsers = () => {
    return db.query(`SELECT * FROM users;`)
        .then(({ rows }) => {
            return rows
        })
}

exports.filterArticlesByTopic = (query) => {
    return db.query(`
    SELECT * FROM topics
    WHERE topics.slug = $1
    `, [query])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: 'Topic does not exist' })
            }
        })
        .then(() => {
            return db.query(`
        SELECT * FROM articles
        WHERE articles.topic = $1
        `, [query])
        })
        .then(({ rows }) => {
            return rows
        })
};

exports.updateComment = (votes, id) => {
    return db.query(`
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2 RETURNING *
    `, [votes.inc_votes, id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: 'comment does not exist' })
            }
            return rows
        })
};

exports.findCommentById = (id) => {
    return db.query(`
        SELECT * FROM comments
        WHERE comment_id = $1;
    `, [id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: 'comment does not exist' })
            }
            return rows
        })
}



