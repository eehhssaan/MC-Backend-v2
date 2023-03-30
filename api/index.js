require("dotenv").config();
const express = require("express");

const app = express();

//root route
app.get("/", (req, res) => {
  res.send("App works properly!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT);
