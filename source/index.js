const express = require("express");
const cors = require('cors');
const app = express();

const cinemeldRoutes = require("./routes/cinemeld");
// const weatherRoutes = require("./routes/weather");

require("dotenv").config()

const addAppRoutes = (appOC) => {
    const logger = appOC.get("Logger");
    
    // request logger
    app.use((req, res, next) => {
        logger.info(`Incoming request ${req.url}`);
        next();
    })
    
    // app routes
    app.use("/cinemeld", cinemeldRoutes);
    // app.use("/weather", weatherRoutes);
}

const { appOCPromise } = require("./ioc");
appOCPromise.then((appOC) => {
    addAppRoutes(appOC);
})

// allowed webapp origins
const corsOptions = {
    origin: [
        "https://dev-cinemeld.willwalker.org",
        "https://cinemeld.willwalker.org",
        "https://willwalker.org",
    ],
    methods: 'OPTIONS',
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.use(express.json());

// CORS preflight
app.options("*", (req, res) => {
    res.status(200).send();
});

// healthcheck
app.all("/", (req, res) => {
    res.send("forty-two"); 
});

// start the app
app.listen(process.env.PORT || 8000);

