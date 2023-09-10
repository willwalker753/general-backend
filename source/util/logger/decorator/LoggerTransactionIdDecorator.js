class LoggerTransactionIdDecorator {
    constructor(service, tidStorage) {
        this.service = service;
        this.tidStorage = tidStorage;
    }

    info(message) {
        this.service.info(this.tidStorage.get() + "  ", ...arguments);
        return this;
    }

    warning(message) {
        this.service.warning(this.tidStorage.get() + "  ", ...arguments);
        return this;
    }

    error(message) {
        this.service.error(this.tidStorage.get() + "  ", ...arguments);
        return this;
    }
}

module.exports = LoggerTransactionIdDecorator;
