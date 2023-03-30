require("dotenv").config();
const express = require("express");

// internal imports
const connectDB = require("../config/db");
const userRoutes = require("../routes/userRoutes");
const { isAuth } = require("../config/auth");

connectDB();
const app = express();

app.use(express.json({ limit: "4mb" }));

//root route
app.get("/", (req, res) => {
  res.send("App works properly!");
});

app.get("/welcome", isAuth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

app.use("/api/user/", isAuth, userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT);
