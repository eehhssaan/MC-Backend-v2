const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  allUsers,
} = require("../controller/userController");

//register a user
router.post("/register", registerUser);

//login a user
router.post("/login", loginUser);

router.get("/", allUsers);

module.exports = router;
