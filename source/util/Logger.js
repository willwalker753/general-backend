class Logger {
    constructor() {

    }

    info() {
        console.log("INFO: " + this._formattedDtUTC() + "  ", ...arguments);
        return this;
    }

    warning() {
        console.log("WARNING: " + this._formattedDtUTC() + "  ", ...arguments);
        return this;
    }

    error() {
        console.log("ERROR: " + this._formattedDtUTC() + "  ", ...arguments);
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

module.exports = Logger;