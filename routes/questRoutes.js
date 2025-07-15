
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Quest = require("../models/Quest");

// Load quests
const questsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/quests.json"), "utf-8")
);

// GET all quests
router.get("/list", (req, res) => {
  res.json(questsData);
});

// GET user quests
router.get("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const completed = await Quest.find({ userId });
    const completedIds = completed.map(q => q.questId);
    const totalPASS = completed.reduce((sum, q) => sum + q.reward, 0);
    res.json({ completed: completedIds, totalPASS });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// POST complete quest
router.post("/complete", async (req, res) => {
  const { userId, questId } = req.body;
  const quest = questsData[questId];
  if (!quest) {
    return res.status(400).json({ success: false, message: "Invalid quest." });
  }

  try {
    const exists = await Quest.findOne({ userId, questId });
    if (exists) {
      return res.status(400).json({ success: false, message: "Already completed." });
    }

    const newQuest = new Quest({
      userId,
      questId,
      reward: quest.reward
    });
    await newQuest.save();

    res.status(200).json({ success: true, reward: quest.reward });
  } catch (err) {
    console.error("Quest complete error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
