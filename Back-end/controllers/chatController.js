
const Group = require('../models/Group');
const Message = require('../models/Message');

const sendMessage = async (req, res) => {
    const { groupId, channelName } = req.params; 
    const { userId, content } = req.body;
  
    try {
      const group = await Group.findById(groupId); 
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
  
      const channel = group.channels.find(c => c.name === channelName);
      if (!channel) {
        return res.status(404).json({ message: 'Channel not found' });
      }
  
      const user = await User.findById(userId); // This is for fetching the user's avatar
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const message = new Message({ 
        content, 
        sender: userId, 
        channelId: channelName,
        senderAvatar: user.avatar || 'images.jpeg' // Here it is for the default avatar
      });
      await message.save();
  
      channel.messages.push(message);
      await group.save();
  
      io.to(`${groupId}_${channelName}`).emit('message', {
        content: message.content,
        senderAvatar: message.senderAvatar
      });
  
      res.status(200).json({ message: 'Message sent successfully', message });
    } catch (error) {
      res.status(500).json({ message: 'Error sending message', error });
    }
  };
  


const getMessages = async (req, res) => {
    const { groupId, channelName } = req.params;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const channel = group.channels.find(c => c.name === channelName);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        res.json(channel.messages); 
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
};

module.exports = {
    sendMessage,
    getMessages
};
