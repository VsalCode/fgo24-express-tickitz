const adminRouter = require("express").Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const { fileUpload } = require("../middlewares/fileUpload.middleware");

const adminController = require("../controllers/admin.controller");

adminRouter.post("", 
  verifyToken, 
  fileUpload.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'backdrop', maxCount: 1 }
  ]), 
  adminController.addNewMovie 
);

module.exports = adminRouter;