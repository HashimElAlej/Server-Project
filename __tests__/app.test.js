const request = require("supertest");
const db = require('../db/connection')
const app = require("../app");
const seed = require("../db/seeds/seed")
const index = require("../db/data/test-data/index")

afterAll(() => {
    return db.end();
});

beforeEach(() => {
    return seed(index);
});

describe("Test for GET API", () => {
    test("GET /api/topics returns code 200", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                const topicArray = index.topicData
                expect(body.topics).toMatchObject(topicArray)
            });
    })
});