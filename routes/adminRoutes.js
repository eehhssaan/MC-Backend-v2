const express = require("express");
const router = express.Router();
const { isAuth, logout } = require("../config/auth");

const {
  registerAdmin,
  loginAdmin,
  registerUser,
  allAdmin,
  //   forgetPassword,
  getAdminById,
  //   updateStaff,
} = require("../controller/adminController");

router.get("/", isAuth, allAdmin);

router.get("/:id", isAuth, getAdminById);

router.post("/register", registerAdmin);

router.post("/registeruser", isAuth, registerUser);

router.post("/login", loginAdmin);

router.post("/logout", logout);

// router.put("/forget-password", forgetPassword);

// router.put("/:id", updateStaff);

module.exports = router;
