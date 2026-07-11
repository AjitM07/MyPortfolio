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
    
    if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
      resource_type = 'raw';
    }
    
    return {
      folder: folder,
      resource_type: resource_type,
      // For raw files like PDF, we don't specify format, otherwise it may break
      format: file.mimetype === 'application/pdf' ? undefined : 'png', 
      public_id: `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9]/g, '_')}`
    };
  }
});

module.exports = { cloudinary, storage };
