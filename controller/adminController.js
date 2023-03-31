require("dotenv").config();
const bcrypt = require("bcryptjs");

// internal import
const Admin = require("../models/Admin");
const { signInToken, tokenForVerify } = require("../config/auth");

const registerAdmin = async (req, res) => {
  try {
    const { name, email, phone, password, role, joiningDate } = req.body;

    const isAdded = await Admin.findOne({ email: email });
    if (isAdded) {
      return res.status(403).send({
        message: "Admin with this Email already exists!!!",
      });
    } else {
      const newAdmin = new Admin({
        name,
        email,
        phone,
        password: bcrypt.hashSync(password),
        role,
        joiningDate,
      });

      const admin = await newAdmin.save();
      const token = tokenForVerify(newAdmin);

      // save admin token
      admin.token = token;

      return res.send({
        token: admin.token,
        success: true,
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        password: admin.password,
        role: admin.role,
        joiningDate: admin.joiningDate,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    // Get admin input
    const { email, password } = req.body;

    // Validate admin input
    if (!(email && password)) {
      res.status(400).send("Please input both email and password");
    }

    const admin = await Admin.findOne({ email: email });
    console.log(admin);

    if (
      admin &&
      admin.password &&
      bcrypt.compareSync(password, admin.password)
    ) {
      const token = signInToken(admin);
      res.send({
        token,
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        joiningDate: admin.joiningDate,
        message: "You have logged in as admin!",
      });
    } else {
      res.status(401).send({
        message: "Invalid admin email or password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const allAdmin = async (req, res) => {
  try {
    const admins = await Admin.find({}).sort({ _id: -1 });
    res.send(admins);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getAdminById = async (req, res) => {
  console.log(req.params.id);
  try {
    const admin = await Admin.findById(req.params.id);
    res.send(admin);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  allAdmin,
  getAdminById,
};
