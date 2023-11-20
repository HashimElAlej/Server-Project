const express = require("express");
const {
  getTopics,
  getApi,
  getArticle
} = require("./controllers/app.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApi)

app.get("/api/articles/:article_id", getArticle)

app.get("/api/articles", getArticle)

module.exports = app;