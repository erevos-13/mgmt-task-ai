import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Destination called:', file);
    // Make sure the uploads directory exists
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    console.log('Filename called:', file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req: any, file: any, cb: any) => {
  // Accept images only
  debugger;
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB max-limit
  },
  fileFilter: fileFilter,
});
