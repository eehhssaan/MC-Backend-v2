require("dotenv").config();
const express = require("express");

// internal imports
const connectDB = require("../config/db");
const userRoutes = require("../routes/userRoutes");

connectDB();
const app = express();

//root route
app.get("/", (req, res) => {
  res.send("App works properly!!!");
});

app.use("/api/user/", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT);
