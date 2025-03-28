// routes/UploadRouter.js
const express = require('express');
const { uploadImage } = require('../controllers/UploadController');
const router = express.Router();

router.post('/upload', uploadImage);

module.exports = router;
