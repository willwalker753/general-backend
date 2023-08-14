const express = require("express");
const router = express.Router();

const Logger = require("../util/Logger");
const ServerError = require("../util/error/ServerError")
const ErrorThrower = require("../util/error/ErrorThrower")
const MovieFront = require("../resources/cinemeld/movie/front/MovieFront");
const MovieServiceTmdb = require("../resources/cinemeld/movie/service/MovieServiceTmdb");
const TmdbApiAgent = require("../resources/cinemeld/movie/request/TmdbApiAgent");

const movieFront = new MovieFront(
    new MovieServiceTmdb(
        new TmdbApiAgent(
            "https://api.themoviedb.org/3"
        ),
        new ErrorThrower(
            ServerError
        )
    ),
    new Logger()
)

router.get("/movie/category/trending", movieFront.getTrendingMovies);

module.exports = router;