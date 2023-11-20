const {
    selectTopics,
    checkEndpoints,
    getArticleById
} = require("../models/app.model");

exports.getTopics = (req, res) => {
    selectTopics().then((data) => {
        res.status(200).send({ topics: data.rows });
    });
}

exports.getApi = (req, res) => {
    checkEndpoints().then((data) => {
        res.status(200).send(data);
    });
}

exports.getArticle = (req, res) => {
    const { article_id } = req.params
    getArticleById(article_id).then(({ rows }) => {
        res.status(200).send(rows);
    });
}