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
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
      return res.status(403).send("Token is required for authentication");
    }
    if (!refreshToken) {
      return res.status(401).send("No refresh token found in cookie");
    }

    const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const { exp } = decodedToken;

    if (Date.now() >= exp * 1000) {
      // refresh token has expired
      return res.status(401).send("Refresh token has expired");
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    req.user = decoded;
    req.body.accesstoken = accessToken;
    next();
  } catch (err) {
    res.status(401).send({
      message: err.message,
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.send({ success: true, message: "Logout successful" });
};

module.exports = {
  tokenForVerify,
  signInToken,
  isAuth,
  logout,
};
