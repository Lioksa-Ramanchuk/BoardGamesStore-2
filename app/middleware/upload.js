import { generateUuid } from '../services/cryptoService.js';
import multer from 'multer';
import path from 'path';

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(process.env.STATIC_DIR, process.env.UPLOADED_ITEM_IMAGE_DIR));
    },
    filename: (req, file, cb) => {
      cb(null, `${new Date().getTime()}-${generateUuid()}${path.extname(file.originalname)}`);
    }
  }),
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);
    const allowedExts = ['.png', '.jpg', '.jpeg', '.gif'];
    if (!allowedExts.includes(ext)) {
      return cb(new Error(`Калі ласка, абярыце выяву памерам да 1МБ. Дазволеныя пашырэнні: ${allowedExts.join(', ')}`));
    }
    cb(null, true);
  },
  limits: { fileSize: 1024 * 1024 }
});

export default upload;