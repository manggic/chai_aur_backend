// Import the 'multer' library for handling file uploads
import multer from "multer";

// Configure storage options for multer using 'diskStorage'
const storage = multer.diskStorage({
  // Specify the destination folder for storing uploaded files
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  // Specify the filename for the uploaded file
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Create and export a multer instance with the configured storage options
export const upload = multer({
  storage,
});
