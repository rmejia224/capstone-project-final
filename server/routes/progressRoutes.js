const express = require("express");
const router = express.Router();

const {
  getExerciseProgress,
  getProgressSummary,
} = require("../controllers/progressController");

const { protect } = require("../middleware/authMiddleware");

router.get("/exercise/:name", protect, getExerciseProgress);
router.get("/summary", protect, getProgressSummary);

module.exports = router;