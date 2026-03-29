const mongoose = require("mongoose");

const personalRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exerciseName: {
      type: String,
      required: true,
      trim: true,
    },
    maxWeight: {
      type: Number,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    estimatedOneRepMax: {
      type: Number,
      required: true,
    },
    workoutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workout",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PersonalRecord", personalRecordSchema);