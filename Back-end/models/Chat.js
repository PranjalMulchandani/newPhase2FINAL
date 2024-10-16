
const ChatSchema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: 'Group' },
  channelId: { type: Schema.Types.ObjectId, ref: 'Channel' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  message: String,
  imageUrl: String,  // New field for storing image URL
  timestamp: { type: Date, default: Date.now }
});
