require("dotenv").config();
const bcrypt = require("bcryptjs");

// internal imports
const User = require("../models/User");
const { signInToken, tokenForVerify } = require("../config/auth");

const registerUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      phone,
      gender,
      firstname,
      lastname,
      birthday,
    } = req.body;

    const isAdded = await User.findOne({ email: email });
    if (isAdded) {
      return res.status(403).send({
        message: "This Email already used!",
      });
    } else {
      const newUser = new User({
        username,
        email,
        phone,
        password: bcrypt.hashSync(password),
        gender,
        firstname,
        lastname,
        birthday,
      });
      const user = await newUser.save();
      const token = tokenForVerify(newUser);

      // save user token
      user.token = token;

      return res.send({
        token: user.token,
        success: true,
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        firstname: user.firstname,
        lastname: user.lastname,
        birthday: user.birthday,
        message: "Account Created, Please Login Now!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("Please input both email and password");
    }

    const user = await User.findOne({ email: email });

    if (user && user.password && bcrypt.compareSync(password, user.password)) {
      const token = signInToken(user);
      res.send({
        token,
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        firstname: user.firstname,
        lastname: user.lastname,
        birthday: user.birthday,
        message: "You have logged in!",
      });
    } else {
      res.status(401).send({
        message: "Invalid user or password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const allUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ _id: -1 });
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  allUsers,
};
