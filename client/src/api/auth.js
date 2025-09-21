// client/src/api/auth.js
import axios from "axios";

export const sendOtp = (aadhaar) =>
  axios.post("/api/auth/send-otp", { aadhaar });

export const verifyOtp = (aadhaar, otp) =>
  axios.post("/api/auth/verify-otp", { aadhaar, otp });
