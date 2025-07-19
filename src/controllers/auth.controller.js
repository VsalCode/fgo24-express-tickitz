const { constants: http } = require("http2");
const { users, profiles } = require('../models');
const { hashPassword } = require("../lib/hashPassword");

exports.register = async function (req, res) {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Email, password, and confirm password are required!",
      });
    }

    if (password !== confirmPassword) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Password and confirm password must be the same!",
      });
    }

    const isExist = await users.findOne({
      where: { email: email }
    });
    
    if (isExist) {
      return res.status(http.HTTP_STATUS_CONFLICT).json({
        success: false,
        message: "Email already registered!",
      });
    }

    const createdProfile = await profiles.create({
      fullname: email.split("@")[0]
    });

    const createdUser = await users.create({
      email: email,
      password: hashPassword(password),
      profile_id: createdProfile.id
    });

    return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: `User with ID ${createdUser.id} registered successfully!`,
      results: {
        userId: createdUser.id,
        email: createdUser.email,
        profileId: createdProfile.id
      }
    });

  } catch (err) {
    
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to register user!",
      errors: err.message,
    });
  }
};