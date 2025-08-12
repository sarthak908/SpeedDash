const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { parseSQLFile } = require('../models/parser');  // ⬅️ Import the parser logic

// Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Upload destination folder
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// 🧠 CONTROLLER: handles the upload + parsing
const handleUpload = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const filePath = req.file.path;

  try {
    const parsedSchema = parseSQLFile(filePath); // 🔍 convert .sql to JSON schema

    // ✅ Deep print the schema with full content
    console.dir(parsedSchema, { depth: null });

    return res.status(200).json({
      message: 'File uploaded and parsed successfully',
      filename: req.file.filename,
      schema: parsedSchema  // ⬅️ important for Gemini/chart
    });
  } catch (error) {
    console.error("Error parsing SQL file:", error);
    return res.status(500).json({ error: 'Failed to parse SQL file' });
  }
};

module.exports = { upload, handleUpload };
