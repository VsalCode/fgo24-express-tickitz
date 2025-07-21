const { redisClient, ensureConnection } = require('../lib/redis'); 

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const setOTP = async (email, otp, expirationMinutes) => {
  try {
    await ensureConnection();
    
    const key = `otp:${email}`;
    const expirationSeconds = expirationMinutes * 10;
    
    await redisClient.setEx(key, expirationSeconds, otp);
    
    return { success: true };
  } catch (error) {
    console.error('Error setting OTP:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

const getOTP = async (email) => {
  try {
    await ensureConnection();
    
    const key = `otp:${email}`;
    const otp = await redisClient.get(key);
    
    return { 
      success: true, 
      otp: otp 
    };
  } catch (error) {
    console.error('Error getting OTP:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

const deleteOTP = async (email) => {
  try {
    await ensureConnection();
    
    const key = `otp:${email}`;
    await redisClient.del(key);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting OTP:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

module.exports = {
  generateOTP,
  setOTP,
  getOTP,
  deleteOTP
};