const userRouter = require("express").Router(); 
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

userRouter.get("", verifyToken, userController.getUserProfile );
userRouter.patch("", verifyToken, userController.updateUserProfile );

module.exports = userRouter;