require("dotenv").config();
const jwt = require("jsonwebtoken");

const tokenForVerify = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    },
    process.env.JWT_SECRET_FOR_VERIFY,
    { expiresIn: "15m" }
  );
};

const signInToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    },
    process.env.JWT_SECRET
  );
};

const isAuth = async (req, res, next) => {
  try {
    if (!req.body.token) {
      return res.status(403).send("A token is required for authentication");
    }
    const token = req.body.token;

    // import currently logged in user and check token saved for that user
    // if req.body.token == token saved in user account > go ahead
    // if not return res.status(403).send("A new is required for authentication")

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({
      message: err.message,
    });
  }
};

module.exports = {
  tokenForVerify,
  signInToken,
  isAuth,
};
