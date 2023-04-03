require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// internal imports
const User = require("../models/User");
const { signInToken } = require("../config/auth");

// works
const loginUser = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("Please input both email and password");
    }

    const user = await User.findOne({ "item.email": email });

    if (
      user &&
      user.item.password &&
      bcrypt.compareSync(password, user.item.password)
    ) {
      const accessToken = signInToken(user);

      res.setHeader("authorization", `Bearer ${accessToken}`);
      const accessExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      const refreshExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      const refreshToken = signInToken({ user, expiry: refreshExpire });

      res.cookie("accessToken", accessToken, { accessExpire, httpOnly: true });
      res.cookie("refreshToken", refreshToken, {
        refreshExpire,
        httpOnly: true,
      });

      (user.password = ""), (user.accessToken = accessToken);
      user.refreshToken = refreshToken;
      user.message = "You have logged in as user!";

      res.send(user);
    } else {
      res.status(401).send({
        message: "Invalid user email or password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// works
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      (user.password = req.body.password || user.item.password),
        (user.firstname = req.body.firstname || user.item.firstname),
        (user.lastname = req.body.lastname || user.item.lastname),
        (user.gender = req.body.gender || user.item.gender),
        (user.email = req.body.email || user.item.email),
        (user.phone = req.body.phone || user.item.phone),
        (user.birthday = req.body.birthday || user.item.birthday);

      const updatedUser = await user.save();
      updatedUser.password = "";
      const accessToken = signInToken(updatedUser);
      updateUser.accessToken = accessToken;
      updateUser.message = "Updated succesfully!";

      res.send(updatedUser);
    }
  } catch (err) {
    res.status(404).send({
      message: "Your email is not valid!",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    user.message = "User deleted successfully";
    user.password = "";
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({
        message: "User not found",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Something went wrong. Please try again later.",
    });
  }
};

// works
const allUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ _id: -1 });
    res.send({
      success: true,
      items: users,
      count: users.length,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// works
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.send(user);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  loginUser,
  updateUser,
  allUsers,
  getUserById,
  deleteUser,
};
