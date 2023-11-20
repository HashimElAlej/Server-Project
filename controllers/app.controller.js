const {
    selectTopics,
    checkEndpoints,
    getArticleById,
    findAllArticles
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
    if (req.params.article_id) {
        const { article_id } = req.params
        getArticleById(article_id).then(({ rows }) => {
            res.status(200).send(rows);
        });
    } else {
        findAllArticles().then(({rows}) => {
            res.status(200).send(rows);
        })
    }
}