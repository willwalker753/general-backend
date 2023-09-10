class ObjectContainerService {
    constructor(storageStrategy, getter, logger) {
        this.storageStrategy = storageStrategy;
        this.getter = getter;
        this.logger = logger;
    }

    get = (name) => {
        const currentBuild = this.storageStrategy.getBuild(name);
        if (currentBuild) {
            return currentBuild;
        }

        this._buildTemplateList(name);
        const newBuild = this.storageStrategy.getBuild(name);

        return newBuild;
    }

    set = (name, template) => {
        this.storageStrategy.addTemplate(name, template);
        return this;
    }

    _buildTemplateList = (name) => {
        const templateList = this.storageStrategy.getTemplateList(name);

        if (templateList.length === 0) {
            this.logger.warning(`Unable to build object container for "${name}" because it's template was not found.`);
            return this;
        }

        let parentBuild = null;
        for (let i=0; i<templateList.length; i++) {
            const curTemplateFunc = templateList[i];
            parentBuild = curTemplateFunc(this, parentBuild);
        }
        const build = parentBuild;

        this.storageStrategy.setBuild(name, build);
        return this;
    }
}

module.exports = ObjectContainerService;