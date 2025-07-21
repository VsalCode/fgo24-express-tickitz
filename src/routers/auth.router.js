const authRouter = require("express").Router(); 
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

authRouter.post("/register", authController.register );
authRouter.post("/login", authController.login );
authRouter.post("/logout", verifyToken, authController.logout );
authRouter.post("/forgot-password", authController.forgotPassword );
authRouter.post("/reset-password", authController.resetPassword );

module.exports = authRouter;