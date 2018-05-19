const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  content: {
    type: String,
    trim: true,
    required: true,
    maxlength: 280,
  },
  user: {
    ref: 'User',
    type: mongoose.Schema.ObjectId,
    require: true,
  },
  likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  comments: [{ type: String, ref: 'User' }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model('Post', PostSchema);
