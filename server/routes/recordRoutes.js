const express = require("express");
const router = express.Router();

const {
  getRecords,
  getRecordByExercise,
  recalculateRecords,
} = require("../controllers/recordController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getRecords);
router.get("/:exerciseName", protect, getRecordByExercise);
router.post("/recalculate", protect, recalculateRecords);

module.exports = router;