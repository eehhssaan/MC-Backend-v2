const express = require("express");
const router = express.Router();

const { loginUser } = require("../controller/userController");

//login a user
router.post("/", loginUser);

module.exports = router;
