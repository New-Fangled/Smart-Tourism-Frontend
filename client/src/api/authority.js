// client/src/api/authority.js

import axios from "axios";

const BASE_URL = "http://localhost:8000";

// Authority Dashboard - Get dashboard stats
export const getAuthorityDashboard = () => {
  const token = localStorage.getItem("accessToken");
  return axios.get(`${BASE_URL}/authority/Dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Approve permit for a user
export const approvePermit = (userId) => {
  const token = localStorage.getItem("accessToken");
  return axios.post(`${BASE_URL}/authority/allowing-permits`, 
    { userId }, 
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
};

// Get destination details with permits
export const getDestinationDetails = (destinationId) => {
  const token = localStorage.getItem("accessToken");
  return axios.get(`${BASE_URL}/authority/destination-details/${destinationId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Additional helper functions for authority dashboard

// Get all destinations (you may need to add this route to your backend)
export const getAllDestinations = () => {
  const token = localStorage.getItem("accessToken");
  return axios.get(`${BASE_URL}/destinations`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Get all pending permits (you may need to add this route to your backend)
export const getPendingPermits = () => {
  const token = localStorage.getItem("accessToken");
  return axios.get(`${BASE_URL}/authority/pending-permits`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const authorityAPI = {
  getAuthorityDashboard,
  approvePermit,
  getDestinationDetails,
  getAllDestinations,
  getPendingPermits
};

export default authorityAPI;