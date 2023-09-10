const buildEmptyObjectContainer = require("./objectContainer/buildEmptyObjectContainer");

const Logger = require("../util/logger/Logger");
const LoggerDateTimeDecorator = require("../util/logger/decorator/LoggerDateTimeDecorator");
const ServerError = require("../util/error/ServerError");
const ErrorThrower = require("../util/error/ErrorThrower");
const ValTester = require("../util/valTester/ValTester");
const ConfigStorage = require("./storage/ConfigStorage");
const EnvVarProcurer = require("../util/env/EnvVarProcurer");

const MovieFront = require("../resources/cinemeld/movie/front/MovieFront");
const MovieServiceTmdb = require("../resources/cinemeld/movie/service/MovieServiceTmdb");
const TmdbApiAgent = require("../resources/cinemeld/tmdbApi/TmdbApiAgent");
const TmdbApiAgentMock = require("../resources/cinemeld/tmdbApi/TmdbApiAgentMock");

const buildAppOC = async () => {
    const appOC = buildEmptyObjectContainer();
    
    const _buildLogger = (container, parent) => {        
        return new LoggerDateTimeDecorator(
            new Logger()
        );
    }
    appOC.set("Logger", _buildLogger);

    const _buildErrorThrower = (container, parent) => {        
        return new ErrorThrower(
            ServerError
        );
    }
    appOC.set("ErrorThrower", _buildErrorThrower);
    
    const _buildValTester = (container, parent) => {        
        return new ValTester();
    }
    appOC.set("ValTester", _buildValTester);

    const _buildConfigStorage = (container, parent) => {
        return new ConfigStorage();
    }
    appOC.set("ConfigStorage", _buildConfigStorage);

    const _buildEnvVarProcurer = (container, parent) => {
        return new EnvVarProcurer(
            container.get("Logger")
        );
    }
    appOC.set("EnvVarProcurer", _buildEnvVarProcurer);

    // wait for environment variable PLATFORM to be set in config storage before continuing
    // so we can determine which classes to build based on platform
    const initializeConfigStorage = require("./initializeConfigStorage");
    initializeConfigStorage(appOC);
    const platform = await appOC.get("ConfigStorage").get("PLATFORM");

    const _buildTmdbApiAgent = (container, parent) => {
        const tmdbApiBaseUrlPromise = container.get("ConfigStorage").get("TMDB_API_URL_BASE");
        // if the app is running locally
        // then use the mock api
        if (platform === "local") {
            const logger = container.get("Logger")
            logger.warning("! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !")
            logger.warning("MOCK TMDB API IN USE because the PLATFORM env variable is set to local")
            logger.warning("! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !")
            return new TmdbApiAgentMock(
                tmdbApiBaseUrlPromise
            );
        }
        return new TmdbApiAgent(
            tmdbApiBaseUrlPromise
        );
    }
    appOC.set("TmdbApiAgent", _buildTmdbApiAgent);

    const _buildCinemeldMovieService = (container, parent) => {
        return new MovieServiceTmdb(
            container.get("TmdbApiAgent"),
            container.get("ErrorThrower")
        )
    }
    appOC.set("CinemeldMovieService", _buildCinemeldMovieService);

    const _buildCinemeldMovieFront = (container, parent) => {
        return new MovieFront(
            container.get("CinemeldMovieService"),
            container.get("Logger")
        );
    }
    appOC.set("CinemeldMovieFront", _buildCinemeldMovieFront);

    return appOC;
}

module.exports = buildAppOC;