
const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
   
    // Well, you or any other user are able to add other channel-specific fields here if you wish to
});

module.exports = mongoose.model('Channel', channelSchema);
