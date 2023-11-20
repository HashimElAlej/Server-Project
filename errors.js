exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === "23502" || err.code === "22P02") {
        res.status(400).send({ msg: 'Bad request' })
    } else {
        next(err)
    }
}

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({status: 404, msg: 'Article does not exist' })
    } else {
        next()
    }
}

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({msg: 'Server error'});
}