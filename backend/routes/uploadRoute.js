const express = require('express');
const router = express.Router();
const { upload, handleUpload } = require('../controllers/uploadController');
router.post('/upload', upload.single('file'), handleUpload);
module.exports = router;
