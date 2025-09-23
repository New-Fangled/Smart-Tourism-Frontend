import api from "./axios";

export const registerUser = async (formData) => {
  const res = await api.post("/auth/register", formData);
  return res.data;
};

export const loginUser = async (formData) => {
  const res = await api.post("/auth/login", formData);
  return res.data;
};

export const getUser = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const changePassword = async (passwordData) => {
  const res = await api.post("/auth/change-password", passwordData);
  return res.data;
};

export const googleAuth = async (tokenData) => {
  const res = await api.post("/auth/google", tokenData);
  return res.data;
};
