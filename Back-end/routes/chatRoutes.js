const multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/chat-images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

app.post('/api/chat/upload-image', upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({
      imageUrl: `/uploads/chat-images/${req.file.filename}`
    });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});
