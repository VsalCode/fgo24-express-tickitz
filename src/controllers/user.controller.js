const { constants: http } = require("http2");
const { users, profiles } = require("../models");

exports.getUserProfile = async function (req, res) {
  try {
    const userId = req.userId;
    const userData = await users.findOne({ where: { id: userId } });
    const profileData = await profiles.findOne({
      where: { id: userData.profile_id },
    });

    if (!userData) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "User profile not found!",
      });
    }

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Success to get user profile!",
      data: {
        user: userData,
        profile: profileData,
      },
    });
  } catch (err) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to get user profile!",
      errors: err.message,
    });
  }
};

exports.updateUserProfile = async function(req, res) {
  try {
    const userId = req.userId;

    const { fullname, email, password, phone } = req.body;

    const updateUsers = await users.update(
      { 
        email: email,
        password: password  
      },
      { where: { id: userId } }
    );
    
    const updateProfiles = await profiles.update(
      { 
        fullname: fullname,
        phone: phone 
      },
      { where: { id: userId } }
    );
  
    if(!updateUsers || !updateProfiles){
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "failed while updating data or user not found!",
      });
    };

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: `Success update user profile with id ${userId} !`
    });

  } catch (err) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to update user profile!",
      errors: err.message,
    });
  };
};