class ConfigStorage {
    constructor() {
        this.storage = {};
    }

    get = (key) => {
        this._initializeKeyIfUnset(key);
        return new Promise((resolve) => {
            if (this.storage[key].value !== null) {
                resolve(this.storage[key].value);
            } else {
                this.storage[key].resolveCallbackList.push(resolve);
            }
        });
    }

    set = (key, value) => {
        this._initializeKeyIfUnset(key);
        this.storage[key].value = value;
        if (this.storage[key].resolveCallbackList.length > 0) {
            this.storage[key].resolveCallbackList.forEach(resolve => resolve(value));
            this.storage[key].resolveCallbackList = [];
        }
        return this;
    }

    _initializeKeyIfUnset = (key) => {
        if (this.storage[key]) return;
        this.storage[key] = {
            value: null,
            resolveCallbackList: []
        }
        return this;
    }
}

module.exports = ConfigStorage;