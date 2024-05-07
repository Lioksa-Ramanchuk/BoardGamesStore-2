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
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.gif') {
      return cb(new Error('Толькі выявы можна запампоўваць на сервер!'));
    }
    cb(null, true);
  },
  limits: { fileSize: 1024 * 1024 }
});

export default upload;