import api from "./authApi";

export const fetchRooms = async () => {
  const res = await api.get("/rooms");

  if (Array.isArray(res.data)) {
    return res.data;
  }

  if (Array.isArray(res.data.data)) {
    return res.data.data;
  }

  return [];
};