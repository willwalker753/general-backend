const Logger = require("../../util/logger/Logger"); 
const LoggerDateTimeDecorator = require("../../util/logger/decorator/LoggerDateTimeDecorator"); 
const Getter = require("../../util/valTester/ValTester");
const Storage = require("../storage/Storage");
const ObjectStorageStrategy = require("./ObjectStorageStrategy");
const ObjectContainerService = require("./ObjectContainerService");
const ObjectContainer = require("./ObjectContainer");

const buildEmptyObjectContainer = () => {    
    const logger = new LoggerDateTimeDecorator(
        new Logger()
    );
    const getter = new Getter();
    const storage = new Storage();
    const objectStorageStrategy = new ObjectStorageStrategy(
        storage, 
        getter
    );
    const objectContainerService = new ObjectContainerService(
        objectStorageStrategy, 
        getter, 
        logger
    );
    const objectContainer = new ObjectContainer(
        objectContainerService
    );

    return objectContainer;
}

module.exports = buildEmptyObjectContainer;
