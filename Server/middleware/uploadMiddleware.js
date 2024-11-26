const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalName = file.originalname.split(".")[0]; // Extract name without extension
    const newFileName = `${originalName}-${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, newFileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2GB limit we can upload until 2GB file
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "video/mp4") {
      cb(null, true); // Accept only MP4 files
    } else {
      cb(null, false);
    }
  },
});

// Middleware to handle single video upload
const uploadSingleVideo = upload.single("video");

// Middleware to add absolute path to req.file
const addAbsolutePath = (req, res, next) => {
  if (req.file) {
    req.file.path = path.resolve(req.file.path); // Convert to absolute path
  }
  next();
};
const createServerFolder = (req, res, next) => {
  try {
    // Define the directory for uploads
    const dir = path.resolve(__dirname, "../uploads");

    // Check if the uploads folder exists, create if it doesn't
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log("Uploads folder created.");
    }

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error("Error creating uploads folder:", error);
    res.status(500).json({ message: "Internal server error while creating folder" });
  }
};

module.exports = { uploadSingleVideo, addAbsolutePath, createServerFolder };
