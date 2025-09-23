import api from "./axios";

export const getUserDashboard = async () => {
  const res = await api.get("/dashboard/user");
  return res.data;
};

export const approvePermit = async (permitId) => {
  const res = await api.post("/dashboard/permit-approve", { userId: permitId });
  return res.data;
};

export const getDestinationDetails = async (id) => {
  const res = await api.get(`/dashboard/destination/${id}`);
  return res.data;
};
