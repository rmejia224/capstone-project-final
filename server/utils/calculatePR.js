const calculateEstimatedOneRepMax = (weight, reps) => {
  if (!weight || !reps) return 0;
  return Number((weight * (1 + reps / 30)).toFixed(2));
};

module.exports = { calculateEstimatedOneRepMax };
