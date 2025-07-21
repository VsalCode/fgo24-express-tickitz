const { redisClient, ensureConnection } = require("../lib/redis");
const jwt = require("jsonwebtoken");

const getTokenExpiration = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp) {
      return decoded.exp;
    }
    return null;
  } catch (error) {
    console.error("Error decoding token for expiration:", error.message);
    return null;
  }
};

const blacklistToken = async (token) => {
  try {
    await ensureConnection();

    const expiresAtSeconds = getTokenExpiration(token);
    if (!expiresAtSeconds) {
      return { 
        success: false,
        message: "Token has no expiration or invalid format." 
       };
    }

    const currentTimestampSeconds = Math.floor(Date.now() / 1000);
    const ttlSeconds = expiresAtSeconds - currentTimestampSeconds;

    if (ttlSeconds <= 0) {
      return { 
        success: true, 
        message: "Token already expired. No need to blacklist"
      };
    }

    const key = `blacklist:token:${token}`;
    await redisClient.setEx(key, ttlSeconds, "true");
    return { 
      success: true,
      message: `Token blacklisted: ${token.substring(0, 10)}`
    };

  } catch (err) {
    return { 
      success: false,
      message: err.message
     };
  }
};

const isTokenBlacklisted = async (token) => {
  try {
    await ensureConnection();
    const key = `blacklist:token:${token}`;
    const result = await redisClient.get(key);
    return result === "true";
  } catch (err) {
    return { 
      success: false,
      message: `Error checking blacklist: ${err.message}`
     };
  }
};

module.exports = {
  blacklistToken,
  isTokenBlacklisted,
};
