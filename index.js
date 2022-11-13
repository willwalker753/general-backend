const express = require("express");
const app = express();

app.all("/", (req, res) => {
    console.log("Testing testing 123")
    res.send("Hello World!")
});

app.listen(process.env.PORT || 3000);