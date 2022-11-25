const express = require("express");
const router = express.Router();

const weatherFront = require("../resources/weather/front/weatherFront");

router.get("/getCurrentWeather", weatherFront.getCurrentWeather);
router.get("/searchCoordsByCityState", weatherFront.searchCoordsByCityState);

module.exports = router;