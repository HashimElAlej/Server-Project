const request = require("supertest");
const db = require('../db/connection')
const app = require("../app");
const seed = require("../db/seeds/seed")
const index = require("../db/data/test-data/index")
const fs = require('fs/promises');
const path = require('path')
const utils = require('../db/seeds/utils');
const { at } = require("../db/data/test-data/articles");

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

                    const exampleArticle = {
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        topic: 'mitch',
                        author: 'butter_bridge',
                        body: 'I find this existence challenging',
                        created_at: '2020-07-09T21:11:00.000Z',
                        votes: 100,
                        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                      }

                    expect(body.article[0]).toMatchObject(exampleArticle);
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

                    const exampleArticle = {
                        article_id: 3,
                        title: 'Eight pug gifs that remind me of mitch',
                        topic: 'mitch',
                        author: 'icellusedkars',
                        body: 'some gifs',
                        created_at: '2020-11-03T09:12:00.000Z',
                        votes: 0,
                        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                        comment_count: '2'
                      }

                    expect(body.articles[0]).toMatchObject(exampleArticle);
                })
        })
    })

    describe("GET /api/articles/:article_id/comments", () => {
        test("Returns all comments from given article with status code 200", () => {
            return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body }) => {
                    const commentsSorted = []

                    index.commentData.map((comment) => {
                        if (comment.article_id == body.article_id) {
                            const convertedTimeToDate =  utils.convertTimestampToDate(comment)
                            const date = convertedTimeToDate['created_at']
                            convertedTimeToDate['created_at'] = date.toISOString()
                            commentsSorted.push(convertedTimeToDate)
                        }
                    })

                    expect(body.comments).toMatchObject(commentsSorted);
                })
        })
    })
});