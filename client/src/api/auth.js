// client/src/api/auth.js

import axios from "axios";

const BASE_URL = "http://localhost:8000";

// User registration
export const registerUser = (data) =>
  axios.post(`${BASE_URL}/users/register`, data);

// User login
export const loginUser = (data) =>
  axios.post(`${BASE_URL}/users/login`, data);

// Authority login (assuming authority login is at /authority/login)
export const loginAuthority = (data) =>
  axios.post(`${BASE_URL}/authority/login`, data);

// Get user profile (JWT required)
export const getUserProfile = () => {
  const token = localStorage.getItem("accessToken");
  return axios.get(`${BASE_URL}/users/user-profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Change password (JWT required)
export const changePassword = (data) => {
  const token = localStorage.getItem("accessToken");
  return axios.post(`${BASE_URL}/users/change-password`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// ===== PERMIT MANAGEMENT =====

// Authority: Approve a permit
export const approvePermit = async (permitId) => {
  console.log('🔄 Approving permit with ID:', permitId);
  const token = localStorage.getItem("accessToken");
  
  try {
    const response = await axios.post(`${BASE_URL}/authority/allowing-permits`, 
      { userId: permitId }, // Note: parameter name is userId but it's actually permitId
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    console.log('✅ Permit approval response:', response.data);
    return response;
  } catch (error) {
    console.error('❌ Permit approval failed:', error);
    console.error('📡 Response data:', error.response?.data);
    console.error('📡 Response status:', error.response?.status);
    throw error;
  }
};

// Authority: Get authority dashboard data
export const getAuthorityDashboard = () => {
  const token = localStorage.getItem("accessToken");
  return axios.get(`${BASE_URL}/authority/Dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Authority: Get destination details
export const getDestinationDetails = (destinationId) => {
  const token = localStorage.getItem("accessToken");
  return axios.get(`${BASE_URL}/authority/destination-details/${destinationId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// User: Check own permit status
export const getMyPermits = () => {
  const token = localStorage.getItem("accessToken");
  return axios.get(`${BASE_URL}/authority/my-permits`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
