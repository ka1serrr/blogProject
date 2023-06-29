import express from 'express';
import mongoose from 'mongoose';
import config from './config.js';
import multer from 'multer';
import { authRouter, commentRouter, postsRouter } from './routes/index.js';
import { router } from './routes/postsRouter.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import cors from 'cors';

const PORT = process.env.PORT || config._port;
const URL = config._bdUrl;

const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}.jpg`); //Appending .jpg
  },
});

export const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));

router.post('/uploads', authMiddleware, upload.single('image'), (req, res) => {
  res.status(200).json({
    url: `/uploads/${req.file.filename}`,
  });
});

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRouter);
app.use('/api', postsRouter);
app.use('/api', commentRouter);

const start = async () => {
  try {
    await mongoose.connect(URL);
    app.listen(PORT, () => console.log(`Server started on ${PORT}`));
  } catch (e) {
    console.log(`Error occurred: ${e}`);
  }
};

start();
