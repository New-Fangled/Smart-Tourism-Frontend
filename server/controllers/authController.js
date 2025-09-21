// server/controllers/authController.js
import { requestOTP, verifyOTP } from "../services/uidaiService.js";
import User from "../models/User.js";

export const sendOtp = async (req, res) => {
  const { aadhaar } = req.body;
  try {
    const response = await requestOTP(aadhaar);
    res.json({ success: true, response });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { aadhaar, otp } = req.body;
  try {
    const response = await verifyOTP(aadhaar, otp);

    // On success → create/find user in DB
    let user = await User.findOne({ aadhaar });
    if (!user) {
      user = new User({ aadhaar });
      await user.save();
    }

    res.json({ success: true, user, response });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
