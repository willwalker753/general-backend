const express = require("express");
const app = express();

const cinemeldRoutes = require("./routes/cinemeld");
const weatherRoutes = require("./routes/weather");

require("dotenv").config()

const Logger = require("./util/Logger");
const logger = new Logger();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.use(express.json());

app.use((req, res, next) => {
    logger.info(`Incoming request ${req.url}`);
    next();
})

app.use("/cinemeld", cinemeldRoutes);
app.use("/weather", weatherRoutes);


app.all("/", (req, res) => {
    res.send("forty-two");
});

app.listen(process.env.PORT || 8000);