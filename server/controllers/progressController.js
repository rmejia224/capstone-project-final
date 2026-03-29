const Workout = require("../models/Workout");
const { calculateEstimatedOneRepMax } = require("../utils/calculatePR");

// @desc    Get exercise progress data
// @route   GET /api/progress/exercise/:name
// @access  Private
const getExerciseProgress = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({ date: 1 });

    const exerciseName = req.params.name.toLowerCase();
    const progressData = [];

    for (const workout of workouts) {
      for (const exercise of workout.exercises) {
        if (exercise.exerciseName.toLowerCase() === exerciseName) {
          let heaviestSet = null;

          for (const set of exercise.sets) {
            if (!heaviestSet || set.weight > heaviestSet.weight) {
              heaviestSet = set;
            }
          }

          if (heaviestSet) {
            progressData.push({
              date: workout.date,
              exerciseName: exercise.exerciseName,
              weight: heaviestSet.weight,
              reps: heaviestSet.reps,
              estimatedOneRepMax: calculateEstimatedOneRepMax(
                heaviestSet.weight,
                heaviestSet.reps
              ),
            });
          }
        }
      }
    }

    res.json(progressData);
  } catch (error) {
    console.error("GET EXERCISE PROGRESS ERROR:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Get dashboard/home summary
// @route   GET /api/progress/summary
// @access  Private
const getProgressSummary = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });

    const totalWorkouts = workouts.length;
    const recentWorkouts = workouts.slice(0, 5);

    let totalSets = 0;
    let totalExercises = 0;

    for (const workout of workouts) {
      totalExercises += workout.exercises.length;

      for (const exercise of workout.exercises) {
        totalSets += exercise.sets.length;
      }
    }

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const weeklyWorkoutCount = workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= sevenDaysAgo && workoutDate <= now;
    }).length;

    const mostRecentWorkout = workouts.length > 0 ? workouts[0] : null;

    res.json({
      totalWorkouts,
      totalExercises,
      totalSets,
      weeklyWorkoutCount,
      mostRecentWorkout,
      recentWorkouts,
    });
  } catch (error) {
    console.error("GET PROGRESS SUMMARY ERROR:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  getExerciseProgress,
  getProgressSummary,
};