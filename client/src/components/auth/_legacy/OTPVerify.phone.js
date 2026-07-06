/**
 * LEGACY — Firebase phone OTP verify component (commented out, not used).
 */
/*
import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import axios from "../../adapters/axios";

function OTPVerify({ handleActions, phoneNumber, setIsLoginComponent, source = "signup" }) {
  const [otp, setOTP] = useState("");
  const { OTPResult } = useSelector((state) => state.userReducer);

  const verifyOTP = async () => {
    await OTPResult.confirm(otp);
    if (source === "signup") {
      handleActions({ openStep1: false, openStep2: true, openOTPVerify: false });
    } else {
      await axios.post("/accounts/login-with-phone", { phone: phoneNumber });
    }
  };

  return (
    <OtpInput value={otp} onChange={setOTP} numInputs={6} />
  );
}
*/

export {};
