import api from "./api";

export const getWorkouts = async (token) => {
  const res = await api.get("/workouts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getWorkoutById = async (id, token) => {
  const res = await api.get(`/workouts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const createWorkout = async (workoutData, token) => {
  const res = await api.post("/workouts", workoutData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateWorkout = async (id, workoutData, token) => {
  const res = await api.put(`/workouts/${id}`, workoutData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteWorkout = async (id, token) => {
  const res = await api.delete(`/workouts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};