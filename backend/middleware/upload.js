const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10 // 10MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common image formats and PDFs
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, JPEG, PNG, GIF, WEBP, and PDF files are allowed.'), false);
    }
  }
});

module.exports = upload;
