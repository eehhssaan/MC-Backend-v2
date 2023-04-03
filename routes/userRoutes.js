const express = require("express");
const router = express.Router();
const { isAuth, logout } = require("../config/auth");

const {
  updateUser,
  allUsers,
  getUserById,
  loginUser,
  deleteUser,
} = require("../controller/userController");

// update a user
router.put("/:id", isAuth, updateUser);

// get all users
router.get("/", isAuth, allUsers);

//get a user by Id
router.get("/:id", isAuth, getUserById);

router.get("/logout", logout);

router.post("/login", loginUser);

router.put("/", isAuth, updateUser);

router.delete("/", isAuth, deleteUser);

module.exports = router;
