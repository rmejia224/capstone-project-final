const Workout = require("../models/Workout");

// @desc    Get all workouts
// @route   GET /api/workouts
const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id });
    res.json(workouts);
  } catch (error) {
    console.error("GET WORKOUTS ERROR:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Get single workout
// @route   GET /api/workouts/:id
const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout || workout.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json(workout);
  } catch (error) {
    console.error("GET WORKOUT BY ID ERROR:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Create workout
// @route   POST /api/workouts
const createWorkout = async (req, res) => {
  try {
    console.log("CREATE WORKOUT BODY:", JSON.stringify(req.body, null, 2));

    const { title, date, notes, exercises } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Workout title is required" });
    }

    if (!Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({ message: "At least one exercise is required" });
    }

    for (const exercise of exercises) {
      if (!exercise.exerciseName || !exercise.exerciseName.trim()) {
        return res.status(400).json({ message: "Each exercise must have a name" });
      }

      if (!Array.isArray(exercise.sets) || exercise.sets.length === 0) {
        return res.status(400).json({ message: "Each exercise must have at least one set" });
      }

      for (const set of exercise.sets) {
        if (
          set.reps === undefined ||
          set.weight === undefined ||
          Number.isNaN(Number(set.reps)) ||
          Number.isNaN(Number(set.weight))
        ) {
          return res.status(400).json({
            message: "Each set must include valid reps and weight",
          });
        }
      }
    }

    const cleanedWorkout = {
      user: req.user.id,
      title: title.trim(),
      date: date || undefined,
      notes: notes?.trim() || "",
      exercises: exercises.map((exercise) => ({
        exerciseName: exercise.exerciseName.trim(),
        category: exercise.category?.trim() || "",
        sets: exercise.sets.map((set) => ({
          reps: Number(set.reps),
          weight: Number(set.weight),
        })),
      })),
    };

    const workout = await Workout.create(cleanedWorkout);

    return res.status(201).json(workout);
  } catch (error) {
    console.error("CREATE WORKOUT ERROR:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Update workout
// @route   PUT /api/workouts/:id
const updateWorkout = async (req, res) => {
  try {
    let workout = await Workout.findById(req.params.id);

    if (!workout || workout.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Workout not found" });
    }

    workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(workout);
  } catch (error) {
    console.error("UPDATE WORKOUT ERROR:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout || workout.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Workout not found" });
    }

    await workout.deleteOne();

    res.json({ message: "Workout removed" });
  } catch (error) {
    console.error("DELETE WORKOUT ERROR:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
};