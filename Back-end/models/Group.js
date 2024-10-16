
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }], 
   
});

module.exports = mongoose.model('Group', groupSchema);

