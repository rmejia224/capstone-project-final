import api from "./api";

export const getRecords = async (token) => {
  const res = await api.get("/records", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const recalculateRecords = async (token) => {
  const res = await api.post(
    "/records/recalculate",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};