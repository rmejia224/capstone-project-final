import api from "./api";

export const getExerciseProgress = async (exerciseName, token) => {
  const res = await api.get(`/progress/exercise/${exerciseName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getProgressSummary = async (token) => {
  const res = await api.get("/progress/summary", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};