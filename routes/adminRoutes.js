const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  allAdmin,
  //   forgetPassword,
  getAdminById,
  //   updateStaff,
} = require("../controller/adminController");

router.get("/", allAdmin);

router.get("/:id", getAdminById);

router.post("/register", registerAdmin);

router.post("/login", loginAdmin);

// router.put("/forget-password", forgetPassword);

// router.put("/:id", updateStaff);

module.exports = router;
