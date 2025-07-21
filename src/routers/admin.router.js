const adminRouter = require("express").Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const { fileUpload } = require("../middlewares/fileUpload.middleware");
const adminController = require("../controllers/admin.controller");
const movieSchema = require("../schemas/movieValidation");

adminRouter.delete("/:id", verifyToken, adminController.deleteMovie );
adminRouter.post("", 
verifyToken, 
fileUpload.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'backdrop', maxCount: 1 }
  ]), 
  movieSchema,
  adminController.addNewMovie 
);
adminRouter.patch("/:id", 
verifyToken, 
  fileUpload.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'backdrop', maxCount: 1 }
  ]), 
  adminController.updateMovie 
);


module.exports = adminRouter;