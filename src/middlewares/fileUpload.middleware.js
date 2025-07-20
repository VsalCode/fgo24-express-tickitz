const path = require("node:path");
const { v4: uuidv4 } = require('uuid');
const multer = require("multer");

const posterStorage = multer.diskStorage({
   destination: (req, file, cb) => {
    cb(null, path.join("uploads", "poster-image"));
   },
   filename: (req, file, cb) => {
    const fileName = file.originalname;
    const ext = fileName.split(".")[1];
    const savedFile = `${uuidv4()}.${ext}`;
    cb(null, savedFile);
  }
});

const backdropStorage = multer.diskStorage({
   destination: (req, file, cb) => {
    cb(null, path.join("uploads", "backdrop-image"));
   },
   filename: (req, file, cb) => {
    const fileName = file.originalname;
    const ext = fileName.split(".")[1];
    const savedFile = `${uuidv4()}.${ext}`;
    cb(null, savedFile);
  }
});

module.exports = {
  posterStorage,
  backdropStorage
};