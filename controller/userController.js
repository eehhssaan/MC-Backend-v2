require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// internal imports
const User = require("../models/User");
const { signInToken, tokenForVerify } = require("../config/auth");

// works
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
      const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
      const createdBy = decoded._id ? decoded._id : "";

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

      let user;
      const token = tokenForVerify(newUser.item);

      // save user token
      newUser.accessToken = token;
      user = await newUser.save();

      return res.send({
        success: user.success,
        // accessToken: user.accessToken,
        id: user._id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        item: user.item,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

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
      const token = signInToken(user.item);
      user.token = token;

      res.send({
        success: true,
        accessToken: token,
        item: {
          _id: user.item._id,
          email: user.item.email,
          phone: user.item.phone,
          gender: user.item.gender,
          firstname: user.item.firstname,
          lastname: user.item.lastname,
          birthday: user.birthday,
          message: "You have logged in!",
        },
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
      const token = signInToken(updatedUser);
      res.send({
        success: true,
        id: user._id,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        item: {
          _id: updatedUser._id,
          password: updatedUser.password,
          firstname: updatedUser.firstname,
          lastname: updatedUser.lastname,
          gender: updatedUser.gender,
          email: updatedUser.email,
          phone: updatedUser.phone,
          birthday: updatedUser.birthday,
        },
      });
    }
  } catch (err) {
    res.status(404).send({
      message: "Your email is not valid!",
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

    res.send({
      success: true,
      item: user.item,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  allUsers,
  getUserById,
};
