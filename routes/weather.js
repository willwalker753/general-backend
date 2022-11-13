const express = require("express");
const router = express.Router();

const weatherController = require("../controllers/weather/weather");

router.get("/test", weatherController.test);

module.exports = router;