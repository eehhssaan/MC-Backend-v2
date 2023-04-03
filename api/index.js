require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// internal imports
const connectDB = require("../config/db");
const userRoutes = require("../routes/userRoutes");
const adminRoutes = require("../routes/adminRoutes");
const { isAuth } = require("../config/auth");

connectDB();
const app = express();

app.use(express.json({ limit: "4mb" }));

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3003",
    ],
  })
);

//cookie parser
app.use(cookieParser());

// Set up session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

//root route
app.get("/", (req, res) => {
  res.send("App works properly!!!");
});

app.get("/welcome", isAuth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

app.use("/api/user/", userRoutes);

app.use("/api/admin/", adminRoutes);

const PORT = process.env.PORT || 3005;

app.listen(PORT);
