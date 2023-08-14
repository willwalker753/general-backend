class ErrorThrower {
    constructor(ServerError) {
        this.ServerError = ServerError;
    }

    server = (clientMessage, internalMessage) => {
        throw new this.ServerError(clientMessage, internalMessage);
    }
}

module.exports = ErrorThrower;