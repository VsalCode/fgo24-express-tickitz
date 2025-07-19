const { redisClient } = require("../lib/redis");

function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString(); 
};

async function setOTP(email, otp, expiryMinutes = 10) {
    const key = `otp:${email}`;
    const expirySeconds = expiryMinutes * 60;
    
    try {
      await redisClient.setEx(key, expirySeconds, otp);
      return { success: true };
    } catch (error) {
      console.error('Error setting OTP:', error);
      return { success: false, error: error.message };
    }
};

async function getOTP(email) {
    const key = `otp:${email}`;
    
    try {
      const otp = await redisClient.get(key);
      return { success: true, otp };
    } catch (error) {
      console.error('Error getting OTP:', error);
      return { success: false, error: error.message };
    }
};

async function deleteOTP(email) {
    const key = `otp:${email}`;
    
    try {
      await redisClient.del(key);
      return { success: true };
    } catch (error) {
      console.error('Error deleting OTP:', error);
      return { success: false, error: error.message };
    }
};

module.exports = {
  generateOTP,
  setOTP,
  getOTP,
  deleteOTP
}; 