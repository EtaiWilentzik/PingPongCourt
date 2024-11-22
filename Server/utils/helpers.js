const fs = require("fs");
const path = require("path");

// Respond.js
const createResponse = (success, statusCode, data = null, message = "") => {
  return {
    success: success,
    statusCode: statusCode,
    data: data,
    message: message,
  };
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

module.exports = { createResponse, createServerFolder };
