const { constants: http } = require("http2");
const { users, profiles } = require('../models');
const { hashPassword, verifyPassword } = require("../lib/hashPassword");

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

exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Email and password are required!",
      });
    }

    const user = await users.findOne({
      where: { email: email },
    });

    if (!user) {
      return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password!",
      });
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password!",
      });
    }

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Login successful!",
      data: {
        user: {
          id: user.id,
          email: user.email,
          profile: user.profile || user.Profile
        },
      }
    });

  } catch (err) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to login!",
      errors: err.message,
    });

  }
};
