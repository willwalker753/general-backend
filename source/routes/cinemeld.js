const express = require("express");
const router = express.Router();

const Logger = require("../util/Logger");
const ServerError = require("../util/error/ServerError")
const ErrorThrower = require("../util/error/ErrorThrower")
const MovieFront = require("../resources/cinemeld/movie/front/MovieFront");
const MovieServiceTmdb = require("../resources/cinemeld/movie/service/MovieServiceTmdb");
const TmdbApiAgent = require("../resources/cinemeld/movie/request/TmdbApiAgent");
const TmdbApiAgentMock = require("../resources/cinemeld/movie/request/TmdbApiAgentMock");

// this function allows classes to be built at request time
registerMovieRoute = (frontMethod, req, res) => {
    const logger = new Logger();

    const tmdbApiBaseUrl = "https://api.themoviedb.org/3";
    let tmdbApiAgent = new TmdbApiAgent(tmdbApiBaseUrl);    
    if (process.env.PLATFORM === "local") {
        logger.warning("! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !")
        logger.warning("MOCK TMDB API IN USE because the PLATFORM env variable is set to local")
        logger.warning("! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !")
        tmdbApiAgent = new TmdbApiAgentMock(tmdbApiBaseUrl);
    }
    
    const movieFront = new MovieFront(
        new MovieServiceTmdb(
            tmdbApiAgent,
            new ErrorThrower(ServerError)
        ),
        logger
    )

    return movieFront[frontMethod](req, res);
}

router.get("/movie/category/trending", (req, res) => registerMovieRoute("getTrendingMovies", req, res));

module.exports = router;