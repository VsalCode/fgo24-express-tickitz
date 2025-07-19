const authRouter = require("express").Router(); 
const authController = require("../controllers/auth.controller");

authRouter.post("/register", authController.register );

module.exports = authRouter;