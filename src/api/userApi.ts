import api from "./authApi";

export const fetchUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};