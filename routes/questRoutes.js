const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Quest = require("../models/Quest");

// JSON görev verilerini yükle
const questsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/quests.json"), "utf-8")
);

// 📌 Tüm görevleri getir
router.get("/list", (req, res) => {
  res.json(questsData);
});

// 📌 Kullanıcının tamamladığı görevleri getir
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

// 📌 Görev tamamlandığında çağrılacak
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

// 📌 Belirli bir kullanıcı görevi MongoDB ObjectId ile sil
router.delete("/user/:mongoId", async (req, res) => {
  const mongoId = req.params.mongoId;
  try {
    const deleted = await Quest.findByIdAndDelete(mongoId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Quest not found." });
    }
    res.status(200).json({ success: true, message: "Quest deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Deletion error." });
  }
});

module.exports = router;
