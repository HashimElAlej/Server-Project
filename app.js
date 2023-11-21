const express = require("express");
const {handlePsqlErrors, handleCustomErrors, handleServerErrors} = require('./errors')
const {
  getTopics,
  getApi,
  getArticles,
  getArticleById,
  getCommentsFromArticle,
  postCommentToArticle
} = require("./controllers/app.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApi)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsFromArticle)

app.post("/api/articles/:article_id/comments", postCommentToArticle)

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app;