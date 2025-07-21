const authRouter = require("express").Router(); 
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const authSchema = require("../schemas/authValidation");

authRouter.post("/register",authSchema.register, authController.register );
authRouter.post("/login", authSchema.login, authController.login );
authRouter.post("/logout", verifyToken, authController.logout );
authRouter.post("/forgot-password", authController.forgotPassword );
authRouter.post("/reset-password", authController.resetPassword );

module.exports = authRouter;