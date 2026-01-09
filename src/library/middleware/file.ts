import multer from 'multer';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'public/img');
  },
  filename: (_req, file, cb)=> {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export default multer({ storage });