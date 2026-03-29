const PersonalRecord = require("../models/PersonalRecord");
const Workout = require("../models/Workout");
const { calculateEstimatedOneRepMax } = require("../utils/calculatePR");

// @desc    Get all personal records
// @route   GET /api/records
// @access  Private
const getRecords = async (req, res) => {
  try {
    const records = await PersonalRecord.find({ user: req.user.id }).sort({
      exerciseName: 1,
      maxWeight: -1,
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get record for one exercise
// @route   GET /api/records/:exerciseName
// @access  Private
const getRecordByExercise = async (req, res) => {
  try {
    const record = await PersonalRecord.findOne({
      user: req.user.id,
      exerciseName: req.params.exerciseName,
    }).sort({ maxWeight: -1 });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Recalculate personal records from workouts
// @route   POST /api/records/recalculate
// @access  Private
const recalculateRecords = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id });

    await PersonalRecord.deleteMany({ user: req.user.id });

    const bestByExercise = {};

    for (const workout of workouts) {
      for (const exercise of workout.exercises) {
        for (const set of exercise.sets) {
          const estimatedOneRepMax = calculateEstimatedOneRepMax(
            set.weight,
            set.reps
          );

          const currentBest = bestByExercise[exercise.exerciseName];

          if (!currentBest || set.weight > currentBest.maxWeight) {
            bestByExercise[exercise.exerciseName] = {
              user: req.user.id,
              exerciseName: exercise.exerciseName,
              maxWeight: set.weight,
              reps: set.reps,
              estimatedOneRepMax,
              workoutId: workout._id,
              date: workout.date,
            };
          }
        }
      }
    }

    const recordsToInsert = Object.values(bestByExercise);

    if (recordsToInsert.length > 0) {
      await PersonalRecord.insertMany(recordsToInsert);
    }

    const updatedRecords = await PersonalRecord.find({ user: req.user.id });

    res.json(updatedRecords);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getRecords,
  getRecordByExercise,
  recalculateRecords,
};