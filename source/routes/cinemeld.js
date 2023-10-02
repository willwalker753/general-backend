const express = require("express");
const router = express.Router();

const { appOCPromise } = require("../ioc");

appOCPromise.then(appOC => {    
    const movieFront = appOC.get("CinemeldMovieFront");
    router.get("/movie/category/trending", movieFront.getTrendingMovies);
    router.get("/movie/summary", movieFront.getSummary);
})

module.exports = router;