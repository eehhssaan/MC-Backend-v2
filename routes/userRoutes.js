const express = require("express");
const router = express.Router();

const {
  registerUser,
  updateUser,
  allUsers,
  getUserById,
} = require("../controller/userController");

//register a user
router.post("/", registerUser);

// update a user
router.put("/:id", updateUser);

// get all users
router.get("/", allUsers);

//get a user by Id
router.get("/:id", getUserById);

module.exports = router;
