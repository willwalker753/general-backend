class Logger {
    constructor() {
        
    }

    info(message) {
        console.log("INFO:  ", ...arguments);
        return this;
    }

    warning(message) {
        console.log("WARN:  ", ...arguments);
        return this;
    }

    error(message) {
        console.log("ERROR: ", ...arguments);
        return this;
    }
}

module.exports = Logger;
