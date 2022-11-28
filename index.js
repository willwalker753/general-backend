const express = require("express");
const app = express();
const weatherRoutes = require("./routes/weather");
require("dotenv").config()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.use(express.json());

app.use("/weather", weatherRoutes);

app.all("/", (req, res) => {
    res.send("forty-two");
});

app.listen(process.env.PORT || 8000);