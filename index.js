const express = require("express");
const app = express();
const weatherRoutes = require("./routes/weather");

app.use(express.json());

app.use("/weather", weatherRoutes);

app.all("/", (req, res) => {
    res.send("forty-two");
});

app.listen(process.env.PORT || 3000);