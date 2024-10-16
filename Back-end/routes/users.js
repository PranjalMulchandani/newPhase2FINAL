const express = require('express');
const {loginUser, registerUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', (req, res) => {
  
  const { username, email, password, role } = req.body;
  registerUser(username, email, password, role)
    .then((user) => res.status(201).json(user))
    .catch((error) => res.status(500).json({ message: 'Error registering user', error }));
});
router.get('/', async (req, res) => {
  try {
      const users = await User.find({}, '_id'); // Fetch only the _id field
      res.json(users);
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Server error');
  }
});
router.post('/promoteUser', async (req, res) => {
  const { userId, role } = req.body;

  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      user.role = role;
      await user.save();
      
      return res.status(200).json({ message: 'User promoted successfully', user });
  } catch (err) {
      return res.status(500).json({ message: 'Server error', error: err });
  }
});

router.delete('/removeUser/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByIdAndDelete(userId); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User removed successfully', user });
  } catch (error) {
    console.error('Error removing user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const multer = require('multer');
const User = require('../models/User');

const upload = multer({ dest: 'uploads/' }); 
router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
  const userId = req.body.userId || req.user._id; 

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.avatar = req.file.path; 
    await user.save();
    res.json({ message: 'Avatar uploaded', user });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: 'Error uploading avatar', err });
}
});
router.post('/login', (req, res) => {
  loginUser(req, res);  
});
module.exports = router;
