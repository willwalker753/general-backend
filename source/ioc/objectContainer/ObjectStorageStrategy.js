class ObjectStorageStrategy {
    constructor(storage, getter) {
        this.storage = storage;
        this.getter = getter;
    }

    getTemplateList = (name) => {
        const container = this.storage.get(name);
        const templates = this.getter.safeGet(() => container.templates, []);
        return templates;
    }

    addTemplate = (name, template) => {
        const container = this.getter.safeGet(() => this.storage.get(name), this._getDefaultContainer());
        container.templates.push(template);
        this.storage.set(name, container);
        return this;
    }

    getBuild = (name) => {
        const container = this.storage.get(name);
        const build = this.getter.safeGet(() => container.build, null);
        return build;
    }

    setBuild = (name, build) => {
        const container = this.getter.safeGet(() => this.storage.get(name), this._getDefaultContainer());
        container.build = build;
        this.storage.set(name, container);
        return this;
    }

    _getDefaultContainer = () => {
        return { "build": null, "templates": [] };
    }
}

module.exports = ObjectStorageStrategy;