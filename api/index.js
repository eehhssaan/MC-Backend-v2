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
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
    ],
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

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
