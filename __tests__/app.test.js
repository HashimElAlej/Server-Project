const request = require("supertest");
const db = require('../db/connection')
const app = require("../app");
const seed = require("../db/seeds/seed")
const index = require("../db/data/test-data/index")
const fs = require('fs/promises');
const path = require('path')

afterAll(() => {
    return db.end();
});

beforeEach(() => {
    return seed(index);
});

describe("Test for GET API", () => {
    describe("GET /api/topics", () => {
        test("Returns code 200 and object with keys slug and description", () => {
            return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({ body }) => {
                    const topicArray = index.topicData
                    expect(body.topics).toMatchObject(topicArray)
                });
        })
    })

    describe("GET /api", () => {
        test("GET /api returns code 200 and documentation of all available endpoints", () => {
            return request(app)
                .get("/api")
                .expect(200)
                .then((data) => {
                    const endpointsFilePath = path.join(__dirname, '../endpoints.json');
                    return fs.readFile(endpointsFilePath, 'utf8')
                        .then(dataFromFile => {
                            const obj = JSON.parse(dataFromFile);
                            expect(data.body).toMatchObject(obj);
                        });
                })
        })
    })

    describe("GET /api/articles/:article_id", () => {
        test("Returns 200 finds an article with the corresponding ID from its endpoint", () => {
            return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then(({ body }) => {
                    const sqlQuery = db.query(`
                        SELECT * FROM articles
                        WHERE article_id = 1
                    `)
                    expect(body.article[0]).toMatchObject(sqlQuery);
                })
        })
        test("Returns 400 when given incorrect ID syntax ", () => {
            return request(app)
                .get("/api/articles/not_an_id")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request')
                })
        })
        test("Returns 404 when given correct ID syntax, but the ID does not exist", () => {
            return request(app)
                .get("/api/articles/100")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Article does not exist')
                })
        })
    })
    describe("GET /api/articles", () => {
        test("Return list of all articles with status 200", () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({ body }) => {
                    const sqlQuery = db.query(`
                    SELECT articles.article_id,articles.title,articles.topic,articles.author,articles.body,articles.created_at,articles.votes,articles.article_img_url, COUNT(comments.article_id) AS comment_count
                    FROM articles
                    JOIN comments ON articles.article_id = comments.article_id
                    GROUP BY articles.article_id,articles.title,articles.topic,articles.author,articles.body,articles.created_at,articles.votes,articles.article_img_url
                    ORDER BY created_at DESC;
                `)
                    expect(body.articles[0]).toMatchObject(sqlQuery);
                })
        })
    })
});