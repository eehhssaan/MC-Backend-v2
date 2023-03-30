const express = require("express");
const router = express.Router();

const { registerUser } = require("../controller/userController");

//register a user
router.get("/", registerUser);

module.exports = router;
