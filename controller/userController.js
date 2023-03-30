const User = require("../models/User");

const registerUser = async (req, res) => {
  // console.log(req);

  return res.status(401).send({
    message: "you have reached dummy registerUser",
  });
};

module.exports = {
  registerUser,
};
