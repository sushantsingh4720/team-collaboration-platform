const User = require("../../models/user");
const admin = require("../../config/firebase");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        error: "Access denied. No token provided.",
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);

    const user = await User.findOne({ email: decodedToken.email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      error: "Invalid token.",
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Access denied. Insufficient permissions.",
      });
    }
    next();
  };
};

module.exports = { auth, authorize };
