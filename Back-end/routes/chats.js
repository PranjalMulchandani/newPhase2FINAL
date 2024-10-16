
const express = require('express');
const { sendMessage, getMessages } = require('../controllers/chatController');
const protect = require('../middleware/auth');
const router = express.Router();

router.post('/:groupId/:channelName/send', protect, sendMessage);
router.get('/:groupId/:channelName', getMessages);

module.exports = router;
