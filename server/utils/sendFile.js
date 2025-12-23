const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images"); // folder to save images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // unique name
  },
});

const fileFilter = (req, file, cb) => {
  const validExtensions = [".png", ".jpg", ".jpeg"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (validExtensions.includes(ext)) cb(null, true);
  else cb(new Error("Only images allowed"));
};

const limits = { fileSize: 10 * 1024 * 1024 }; // 10 MB

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;
