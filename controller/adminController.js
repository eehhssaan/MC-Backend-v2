require("dotenv").config();
const bcrypt = require("bcryptjs");

// internal import
const Admin = require("../models/Admin");
const User = require("../models/User");

const { signInToken } = require("../config/auth");

const registerUser = async (req, res) => {
  try {
    const { email, password, phone, gender, firstname, lastname, birthday } =
      req.body;

    const isAdded = await User.findOne({ "item.email": email });
    if (isAdded) {
      return res.status(403).send({
        message: "This Email already used!",
      });
    } else {
      const createdBy = req.user._id ? req.user._id : "";

      const newUser = new User({
        success: true,
        item: {
          id: req.body._id,
          email: email,
          password: bcrypt.hashSync(password),
          firstname: firstname,
          lastname: lastname,
          gender: gender,
          phone: phone,
          birthday: birthday,
          createdBy: createdBy,
        },
      });

      let userRes = await newUser.save();
      userRes.item.password = "";
      delete userRes.item.password;
      userRes.accessToken = req.body.token;

      return res.send(userRes);
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!(name | email || phone || password)) {
      return res.send({
        message: "Please had all required information",
      });
    }

    const isAdded = await Admin.findOne({ email: email });
    if (isAdded) {
      return res.send({
        message: "Admin with this Email already exists!!!",
      });
    } else {
      const newAdmin = new Admin({
        name,
        email,
        phone,
        password: bcrypt.hashSync(password),
        role: "Admin",
        joiningDate: new Date(),
      });

      const admin = await newAdmin.save();

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
  console.log(req.body);
  try {
    // Get admin input
    const { email, password } = req.body;
    const userIp = req.ip;
    const sessionData = req.session;
    const userId = email;

    // Validate admin input
    if (!(email && password)) {
      res.status(400).send("Please input both email and password");
    }

    const admin = await Admin.findOne({ email: email });

    // Check if user already has an active session
    if (sessionData.userId && sessionData.userIp !== userIp) {
      console.log("user already login");
      return res
        .status(401)
        .send("User already has an active session on a different device");
    } else {
      // Store session data in server-side database
      sessionData.userId = userId;
      sessionData.userIp = userIp;
    }

    if (
      admin &&
      admin.password &&
      bcrypt.compareSync(password, admin.password)
    ) {
      const accessToken = signInToken(admin);

      res.setHeader("authorization", `Bearer ${accessToken}`);
      const accessExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      const refreshExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      const refreshToken = signInToken({ admin, expiry: refreshExpire });

      res.cookie("accessToken", accessToken, { accessExpire, httpOnly: true });
      res.cookie("refreshToken", refreshToken, {
        refreshExpire,
        httpOnly: true,
      });

      (admin.password = ""), (admin.accessToken = accessToken);
      admin.refreshToken = refreshToken;
      admin.message = "You have logged in as admin!";

      return res.send(admin);
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
  registerUser,
};
