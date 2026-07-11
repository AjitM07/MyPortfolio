const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  issuingOrganization: { type: String, required: true, trim: true },
  issueDate: { type: Date, required: true },
  credentialUrl: { type: String, default: '' },
  file: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Certification', CertificationSchema);
