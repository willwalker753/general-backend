const safeGet = require("./safeGet");
const Logger = require("./Logger");
const logger = new Logger();

const errorHandler= (
    error,
    res, 
    clientMsg="An unknown error occured, please try again soon.", 
    statusCode=500
) => {

    logger.error(
        safeGet(error => error.response.data, error)
    )

    res.status(statusCode).send({
        is_error: true,
        message: clientMsg
    })
}

module.exports = errorHandler;