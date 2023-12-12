const cors = require('cors');
const express = require("express");
const {handlePsqlErrors, handleCustomErrors, handleServerErrors} = require('./errors')
const {
  getTopics,
  getApi,
  getArticles,
  getArticleById,
  getCommentsFromArticle,
  postCommentToArticle,
  patchArticle,
  getUsers,
  patchCommentById
} = require("./controllers/app.controller");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApi)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsFromArticle)

app.post("/api/articles/:article_id/comments", postCommentToArticle)

app.patch("/api/articles/:article_id", patchArticle)

app.get("/api/users", getUsers)

app.patch("/api/comments/:comment_id", patchCommentById)

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

// app.use((req, res, next) => {
//   const err = new Error('Not Found');
//   err.msg = 'Not Found'
//   err.status = 404;
//   next(err);
// });

// app.use((err, req, res, next) => {
//   res.status(err.status || 500).send({
//     status: err.status || 500,
//     msg: err.msg || 'Internal Server Error',
//   });
// });

module.exports = app;