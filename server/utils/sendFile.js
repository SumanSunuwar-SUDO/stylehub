const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "stylehub",
    public_id: (req, file) =>
      file.originalname.split(".")[0] + "-" + Date.now(),
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
