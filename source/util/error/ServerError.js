class ServerError extends Error {
    constructor(clientMessage, internalMessage) {
        super();
        this.type = "server";
        this.clientMessage = clientMessage;
        this.internalMessage = internalMessage;
    }
}

module.exports = ServerError;