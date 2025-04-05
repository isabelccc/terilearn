import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  path: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  }
});

export default mongoose.models.File || mongoose.model('File', FileSchema); 