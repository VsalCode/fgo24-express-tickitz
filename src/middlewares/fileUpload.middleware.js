const path = require("node:path");
const { v4: uuidv4 } = require('uuid');
const multer = require("multer");

const movieStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'poster') {
      cb(null, path.join("uploads", "poster-image"));
    } else if (file.fieldname === 'backdrop') {
      cb(null, path.join("uploads", "backdrop-image"));
    } else {
      cb(new Error('Unexpected field name'), false);
    }
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname;
    const ext = path.extname(fileName); 
    const savedFile = `${uuidv4()}${ext}`;
    cb(null, savedFile);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const fileUpload = multer({ 
  storage: movieStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: fileFilter
});

module.exports = {
  fileUpload,
  posterStorage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join("uploads", "poster-image"));
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname;
      const ext = path.extname(fileName);
      const savedFile = `${uuidv4()}${ext}`;
      cb(null, savedFile);
    }
  }),
  backdropStorage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join("uploads", "backdrop-image"));
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname;
      const ext = path.extname(fileName);
      const savedFile = `${uuidv4()}${ext}`;
      cb(null, savedFile);
    }
  })
};