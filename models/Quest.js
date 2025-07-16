const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  questId: {
    type: String,
    required: true
  },
  reward: {
    type: Number,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quest', questSchema);
