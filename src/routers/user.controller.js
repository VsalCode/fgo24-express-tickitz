const userRouter = require("express").Router(); 
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware")

userRouter.get("", verifyToken, userController.getUserProfile );

module.exports = userRouter;