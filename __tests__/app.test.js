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
    test("GET /api/topics returns code 200 and object with keys slug and description", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                const topicArray = index.topicData
                expect(body.topics).toMatchObject(topicArray)
            });
    })

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

    test("GET /api/articles/:article_id finds an article with the corresponding ID from its endpoint", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({body}) => {
                const sqlQuery = db.query(`
                    SELECT * FROM articles
                    WHERE article_id = 1
                `)
                expect(body[0]).toMatchObject(sqlQuery);
            })
    })

    test("GET /api/articles/ should return list of all articles", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({body}) => {
                const sqlQuery = db.query(`
                    SELECT * FROM articles
                `)
                expect(body[0]).toMatchObject(sqlQuery);
            })
    })
});