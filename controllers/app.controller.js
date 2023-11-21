const {
    selectTopics,
    checkEndpoints,
    selectArticleById,
    findAllArticles,
    findAllCommentsFromArticle
} = require("../models/app.model");

exports.getTopics = (req, res, next) => {
    selectTopics().then((data) => {
        res.status(200).send({ topics: data.rows });
    })
    .catch((err) => {
        next(err)
    });
}

exports.getApi = (req, res, next) => {
    checkEndpoints().then((data) => {
        res.status(200).send(data);
    })
    .catch((err) => {
        next(err)
    });
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    selectArticleById(article_id).then(({ rows }) => {
        res.status(200).send({article: rows});
    })
    .catch((err) => {
        next(err)
    });
}

exports.getArticles = (req, res, next) => {
    findAllArticles().then((articles) => {
        res.status(200).send({articles});
    })
    .catch((err) => {
        next(err)
    });
}

exports.getCommentsFromArticle = (req, res, next) => {
    const { article_id } = req.params
    findAllCommentsFromArticle(article_id).then((comments) => {
        res.status(200).send({comments, article_id});
    })
    .catch((err) => {
        next(err)
    });
}