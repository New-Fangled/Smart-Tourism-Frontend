// server/services/uidaiService.js
import axios from "axios";

const AUA_CODE = "public";
const SA_CODE = "public";
const LICENSE_KEY = "MG_g7jJVYUIW7cLYXY5yaqKD6D1TuhjTJTDPHcb0SudOhVpvpnsEw_A";
const BASE_URL = "http://developer.uidai.gov.in"; // sandbox only

// Request OTP
export const requestOTP = async (aadhaar) => {
  try {
    const url = `${BASE_URL}/otp/1.6/${AUA_CODE}/${aadhaar[0]}/${aadhaar[1]}/${SA_CODE}`;
    const xmlPayload = `<OtpRequest uid="${aadhaar}" ac="${AUA_CODE}" sa="${SA_CODE}" lk="${LICENSE_KEY}" ver="1.6" txn="TXN12345" ts="2025-09-20T12:00:00"> <Opts ch="00" /> </OtpRequest>`;

    const res = await axios.post(url, xmlPayload, {
      headers: { "Content-Type": "application/xml" },
    });

    return res.data;
  } catch (err) {
    throw new Error("OTP request failed: " + err.message);
  }
};

// Verify OTP
export const verifyOTP = async (aadhaar, otp) => {
  try {
    const url = `${BASE_URL}/auth/1.6/${AUA_CODE}/${aadhaar[0]}/${aadhaar[1]}/${SA_CODE}`;
    const xmlPayload = `<Auth uid="${aadhaar}" tid="public" ac="${AUA_CODE}" sa="${SA_CODE}" ver="1.6" txn="TXN54321" lk="${LICENSE_KEY}">
        <Uses otp="y"/>
        <Otp value="${otp}"/>
      </Auth>`;

    const res = await axios.post(url, xmlPayload, {
      headers: { "Content-Type": "application/xml" },
    });

    return res.data;
  } catch (err) {
    throw new Error("OTP verification failed: " + err.message);
  }
};
