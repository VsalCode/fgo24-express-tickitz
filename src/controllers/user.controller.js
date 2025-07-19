// user.controller.js
const { constants: http } = require("http2");
const { users, profiles } = require("../models");

exports.getUserProfile = async function (req, res) { 
    try {
        const userId = req.userId;
        const userData = await users.findOne({ where: { id: userId } });
        const profileData = await profiles.findOne({ where: { id: userData.profile_id } });

        if (!userProfile) {
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
                profile: profileData
            }
        });

    } catch (err) {
        console.error("Error in getProfile:", err); // Log error untuk debugging
        return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to get user profile!",
            errors: err.message,
        });
    }
}