const {
    selectTopics,
    checkEndpoints,
    selectArticleById,
    findAllArticles,
    findAllCommentsFromArticle,
    addCommentToArticle,
    updateVotes,
    findAllUsers,
    filterArticlesByTopic

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
    const { topic } = req.query;

    const articlesPromise = topic ? filterArticlesByTopic(topic) : findAllArticles();

    articlesPromise
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch((err) => {
            next(err);
        });
}

exports.getCommentsFromArticle = (req, res, next) => {
    const { article_id } = req.params
    findAllCommentsFromArticle(article_id).then((comments) => {
        res.status(200).send({ comments, article_id });
    })
        .catch((err) => {
            next(err)
        });
}

exports.postCommentToArticle = (req, res, next) => {
    const { article_id } = req.params
    const { body } = req
    addCommentToArticle(body, article_id).then((comment) => {
        res.status(201).send({ comment });
    })
        .catch((err) => {
            next(err)
        });
}

exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params
    const { body } = req
    updateVotes(body, article_id).then((updatedArticle) => {
        res.status(200).send(updatedArticle);
    })
        .catch((err) => {
            next(err)
        });
}

exports.getUsers = (req, res, next) => {
    findAllUsers().then((users) => {
        res.status(200).send({ users });
    })
        .catch((err) => {
            next(err)
        });
}