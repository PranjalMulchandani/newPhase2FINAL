
const Group = require('../models/Group');

exports.getGroups = async (req, res) => {
    try {
        const groups = await Group.find(); 
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching groups', error });
    }
};

exports.createGroup = async (req, res) => {
    const { name } = req.body;

    try {
        const newGroup = new Group({ name, createdBy: req.user._id });
        await newGroup.save();
        res.status(201).json({ message: 'Group created successfully', group: newGroup });
    } catch (error) {
        res.status(500).json({ message: 'Error creating group', error });
    }
};

exports.removeGroup = async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await Group.findOne({ _id: groupId, createdBy: req.user._id });
        if (!group) {
            return res.status(403).json({ message: 'You can only delete groups you created' });
        }

        await group.remove();
        res.json({ message: 'Group removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing group', error });
    }
};


const { io } = require('../index'); 

exports.addChannelToGroup = async (req, res) => {
    const { groupId } = req.params;
    const { channelName } = req.body;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        group.channels.push({ name: channelName });
        await group.save();

        io.emit('channelUpdated', { groupId }); // Emit event
        res.json({ message: 'Channel created', group });
    } catch (err) {
        res.status(500).json({ message: 'Error creating channel', err });
    }
};

exports.removeChannel = async (req, res) => {
    const { groupId, channelName } = req.params;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        group.channels = group.channels.filter(channel => channel.name !== channelName);
        await group.save();

        io.emit('channelUpdated', { groupId }); // Emit event
        res.json({ message: 'Channel removed', group });
    } catch (err) {
        res.status(500).json({ message: 'Error removing channel', err });
    }
};

