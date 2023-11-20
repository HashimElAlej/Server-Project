const {
    topicsFunc,
} = require("../models/app.model");

exports.getTopics = (req, res) => {
    topicsFunc().then((data) => {
        res.status(200).send({ topics: data.rows });
    });
}