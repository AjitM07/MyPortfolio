const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine folder and resource type dynamically
    const folder = 'portfolio';
    
    // Default format and resource type
    let resource_type = 'image';
    let format = 'png';
    
    if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
      resource_type = 'image'; // Bypasses Cloudinary's "untrusted raw" block by uploading PDF as image
      format = 'pdf';
    }
    
    return {
      folder: folder,
      resource_type: resource_type,
      format: format,
      // Keep the file extension (allow dots) so Cloudinary URL ends with .pdf
      public_id: `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    };
  }
});

module.exports = { cloudinary, storage };
