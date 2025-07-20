const adminRouter = require("express").Router();
const adminController = require("../controllers/admin.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

adminRouter.post("", verifyToken, adminController.addNewMovie );

module.exports = adminRouter;