class LoggerDateTimeDecorator {
    constructor(service) {
        this.service = service;
    }

    info(message) {
        this.service.info(this._formattedDtUTC() + "  ", ...arguments);
        return this;
    }

    warning(message) {
        this.service.warning(this._formattedDtUTC() + "  ", ...arguments);
        return this;
    }

    error(message) {
        this.service.error(this._formattedDtUTC() + "  ", ...arguments);
        return this;
    }

    _formattedDtUTC() {
        const d = new Date();
        const utcDt = d.toUTCString();
        const isoDt = d.toISOString(utcDt);
        const formattedDt = isoDt.replace("Z", "");
        return formattedDt;
    }
}

module.exports = LoggerDateTimeDecorator;
