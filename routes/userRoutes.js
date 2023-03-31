const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  allUsers,
  updateUser,
} = require("../controller/userController");

//register a user
router.post("/register", registerUser);

//login a user
router.post("/login", loginUser);

// update a user
router.put("/:id", updateUser);

router.get("/", allUsers);

module.exports = router;
