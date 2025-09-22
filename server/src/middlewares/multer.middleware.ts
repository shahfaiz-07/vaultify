// src/config/multer.ts
import multer, { StorageEngine } from 'multer';
import { MimeType } from '../types/enums/MimeType.js';

const allowedMimeTypes = Object.values(MimeType);

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/temp');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if(allowedMimeTypes.includes(file.mimetype as MimeType)) {
        console.log("Valid file type attempted:", file.mimetype); 
        cb(null, true);
    } else {
        console.log("Invalid file type attempted:", file.mimetype);
        const error = new Error('Invalid file type');
        cb(error);
    }
}

export const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB file size limit
});
