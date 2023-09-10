class Storage {
    constructor() {
        this.storage = {};
    }

    get = (key) => {
        return this.storage[key];
    }

    set = (key, value) => {
        this.storage[key] = value;
        return this;
    }
}

module.exports = Storage;