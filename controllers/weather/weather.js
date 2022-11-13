const test = (req, res) => {
    res.status(200).send({
        "result": "probably working"
    })
}

module.exports = {
    test
}