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
                            const convertedTimeToDate = utils.convertTimestampToDate(comment)
                            const date = convertedTimeToDate['created_at']
                            convertedTimeToDate['created_at'] = date.toISOString()
                            commentsSorted.push(convertedTimeToDate)
                        }
                    })

                    expect(body.comments).toMatchObject(commentsSorted);
                })
        })
        test("404: ID does not exist", () => {
            return request(app)
                .get("/api/articles/100/comments")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Article does not exist');
                })
        })
        test("400: ID synatx error, cannot query", () => {
            return request(app)
                .get("/api/articles/characters/comments")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request');
                })
        })
    })
    describe("GET request to recive data on users", () => {
        test("Status 200: Array of user data returned", () => {
            return request(app)
                .get("/api/users")
                .expect(200)
                .then(({ body }) => {
                    body.users.forEach((user) => {
                        expect(user).toHaveProperty("username")
                        expect(user).toHaveProperty("name")
                        expect(user).toHaveProperty("avatar_url")
                    })
                });
        })
    })


    describe("GET: filter articles by certain topic", () => {
        test("Status 200: return like articles with the correct stuff", () => {
            return request(app)
                .get("/api/articles?topic=paper")
                .expect(200)
                .then(({ body }) => {
                    if (body.articles.length) {
                        body.articles.forEach((article) => {
                            expect(article).toHaveProperty("article_id")
                            expect(article).toHaveProperty("title")
                            expect(article).toHaveProperty("topic")
                            expect(article).toHaveProperty("author")
                            expect(article).toHaveProperty("body")
                            expect(article).toHaveProperty("created_at")
                            expect(article).toHaveProperty("article_img_url")
                        })
                    }
                    else {
                        expect(body.articles).toEqual([])
                    }
                })
        })
        test("Status 404: non existant topic", () => {
            return request(app)
                .get("/api/articles?topic=65765")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Topic does not exist')
                })
        })
    });
});

describe("Test for POST API", () => {
    test("Status 201: POST /api/articles/:article_id/comments", () => {
        const newComment = {
            body: "I don't quite agree with that",
            votes: 120,
            author: "butter_bridge",
            article_id: 1,
            created_at: "2023-11-21T11:57:29.253Z",
        }

        return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                expect(body.comment[0]['body']).toBe("I don't quite agree with that")
                expect(body.comment[0]['comment_id']).toBe(19)
                expect(body.comment[0]['article_id']).toBe(1)
                expect(body.comment[0]['votes']).toBe(120)
                expect(body.comment[0]['author']).toBe("butter_bridge")
                expect(body.comment[0]['created_at']).toBe("2023-11-21T11:57:29.253Z")
            })
    })

    test("Status 404: Incorrect ID endpoint", () => {
        const newComment = {
            body: "I don't quite agree with that",
            votes: 120,
            author: "butter_bridge",
            article_id: 1,
            created_at: "2023-11-21T11:57:29.253Z",
        }

        return request(app)
            .post("/api/articles/not-an-id/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article does not exist')
            })
    })

    test("Status 400: Incorrect syntax for article_id ", () => {
        const newComment = {
            body: "I don't quite agree with that",
            votes: 120,
            author: "butter_bridge",
            article_id: 'not_an_id',
            created_at: "2023-11-21T11:57:29.253Z",
        }

        return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request')
            })
    })

    test("Status 400: Incorrect article_id and endpoint ID ", () => {
        const newComment = {
            body: "I don't quite agree with that",
            votes: 120,
            author: "butter_bridge",
            article_id: 'not_an_id',
            created_at: "2023-11-21T11:57:29.253Z",
        }

        return request(app)
            .post("/api/articles/'not_an_id'/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request')
            })
    })
})

describe("Test for PATCH API", () => {
    test("Status 200: updates with the new votes count", () => {

        const newVote = { inc_votes: -100 }

        return request(app)
            .patch("/api/articles/1")
            .send(newVote)
            .expect(200)
            .then(({ body }) => {

                const updatedArticle = {
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09T21:11:00.000Z',
                    votes: 0,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                }

                expect(body[0]).toMatchObject(updatedArticle)
            })
    })

    test("Status 400: Incorrect endpoint ID", () => {

        const newVote = { inc_votes: -100 }

        return request(app)
            .patch("/api/articles/not-an-id")
            .send(newVote)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request')

            })
    })

    test("Status 404: cannot query non-existing ID", () => {

        const newVote = { inc_votes: -100 }

        return request(app)
            .patch("/api/articles/100000")
            .send(newVote)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article does not exist')

            })
    })
})