const express = require('express');

const router = express.Router();
const Group = require('../models/Group');
const Channel = require('../models/Channel');
router.get('/', async (req, res) => {
  try {
      const groups = await Group.find(); // Fetch all groups from the database
      return res.status(200).json(groups);
  } catch (error) {
      console.error('Error loading groups:', error);
      return res.status(500).json({ message: 'Server error' });
  }
});


router.post('/create', async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log request data
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Group name is required' });
    }

    const newGroup = new Group({ name });
    await newGroup.save();

    res.status(201).json({ message: 'Group created successfully', group: newGroup });
  } catch (error) {
    console.error('Error creating group:', error); // HERE IS THE LOG ERROR
    res.status(500).json({ error: 'Failed to create group' });
  }
});
// As an instruction you can delete a user by its ID
router.delete('/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findByIdAndDelete(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



  router.post('/:groupId/addChannel', async (req, res) => {
    try {
        const { name } = req.body;  // Channel name from request body
        const groupId = req.params.groupId;

        // Check if the channel name is provided
        if (!name) {
            return res.status(400).json({ message: 'Channel name is required' });
        }

        // Create a new Channel object
        const newChannel = new Channel({ name, groupId });

        // Save the channel to the database
        await newChannel.save();

        // Find the group by ID
        const group = await Group.findById(groupId);

        // Check if the group exists
        if (!group) {
            return res.status(404).json({ message: 'Group not found' }); // Return error if group not found
        }

        // Ensure channels array exists before pushing
        if (!group.channels) {
            group.channels = []; // Initialize if not already an array
        }

        // Add the channel to the group’s channels array
        group.channels.push(newChannel);
        await group.save();

        res.status(201).json(newChannel);
    } catch (err) {
        console.error("Error adding channel: ", err);
        res.status(500).json({ error: 'Server error' });
    }
});


    
module.exports = router;
