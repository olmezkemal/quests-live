
const mongoose = require("mongoose");

const QuestSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  questId: { type: String, required: true },
  completedAt: { type: Date, default: Date.now },
  reward: { type: Number, required: true }
});

module.exports = mongoose.model("Quest", QuestSchema);
