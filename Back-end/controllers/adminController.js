
const User = require('../models/User');

exports.promoteUser = async (req, res) => {
    const { userId } = req.params;
    const { newRole } = req.body; 
  
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (['admin', 'super-admin'].includes(newRole)) {

            if (!user.roles.includes(newRole)) {
                user.roles.push(newRole);             }
            await user.save();
            res.json({ message: `User promoted to ${newRole}`, user });
        } else {
            res.status(400).json({ message: 'Invalid role' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error promoting user', err });
    }
};

exports.removeUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User removed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error removing user', err });
    }
};
