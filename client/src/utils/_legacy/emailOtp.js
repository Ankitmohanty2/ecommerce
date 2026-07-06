/** DISABLED — Email OTP API client. See services/emailOtpService.js on backend. */
import axios from "../../adapters/axios";

export const sendEmailOtp = (email, purpose = "signup") =>
  axios.post("/accounts/send-email-otp", { email, purpose });

export const verifyEmailOtp = (email, otp, purpose = "signup") =>
  axios.post("/accounts/verify-email-otp", { email, otp, purpose });
