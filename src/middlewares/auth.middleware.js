const jwt = require("jsonwebtoken");
const { constants: http } = require("http2");
const { isTokenBlacklisted } = require("../utils/blacklistToken");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({ 
      message: "Access denied. Token not provided" 
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({ 
      message: "The token format is invalid." 
    });
  }

  try {
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
        message: "Token has been revoked. Please log in again."
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(http.HTTP_STATUS_FORBIDDEN).json({ 
        message: "The token doesnt have a valid user ID."   
      });
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({ 
        message: "Token expired." 
      });
    }
    return res.status(http.HTTP_STATUS_FORBIDDEN).json({ 
      message: "Token invalid." 
    });
  }
};

module.exports = {
  verifyToken,
};
