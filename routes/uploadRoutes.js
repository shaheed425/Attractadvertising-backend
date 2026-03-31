import path from 'path';
import express from 'express';
import multer from 'multer';
import { upload } from "../upload/multer.js";

const router = express.Router();

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename(req, file, cb) {
//     cb(
//       null,
//       `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });

// function checkFileType(file, cb) {
//   const filetypes = /jpg|jpeg|png|webp|mp4|webm/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb('Images and Videos only!');
//   }
// }

// const upload = multer({
//   storage,
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
// });

// router.post('/', upload.single('media'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }
//   res.send(`/${req.file.path.replace(/\\/g, '/')}`);
// });
router.post('/', (req, res) => {
  upload.single('media')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error('Multer Error:', err);
      return res.status(500).json({ message: 'Multer Error', error: err.message });
    } else if (err) {
      console.error('Upload Error:', err);
      return res.status(500).json({ message: 'Upload Error', error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    console.log('File uploaded successfully:', req.file.path);
    res.send(req.file.path);
  });
});

export default router;
