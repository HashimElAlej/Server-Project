const {
    selectTopics,
    checkEndpoints
} = require("../models/app.model");

exports.getTopics = (req, res) => {
    selectTopics().then((data) => {
        res.status(200).send({ topics: data.rows });
    });
}

exports.getApi = (req, res) => {
    checkEndpoints().then((data) => {
        res.status(200).send(data);
    });
}