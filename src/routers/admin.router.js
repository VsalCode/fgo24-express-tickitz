const adminRouter = require("express").Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const multer = require("multer");
const { posterStorage, backdropStorage } = require("../middlewares/fileUpload.middleware");

const adminController = require("../controllers/admin.controller");
const posterImage = multer({ storage: posterStorage });
const backdropImage = multer({ storage: backdropStorage });

adminRouter.post("", 
  verifyToken, 
  posterImage.single('poster'), 
  backdropImage.single('backdrop'), 
  adminController.addNewMovie 
);

module.exports = adminRouter;
