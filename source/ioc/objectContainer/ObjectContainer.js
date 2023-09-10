class ObjectContainer {
    constructor(service) {
        this.service = service;
    }

    get = (name) => {
        return this.service.get(name);
    }

    set = (name, template) => {
        this.service.set(name, template);
        return this
    }
}

module.exports = ObjectContainer;