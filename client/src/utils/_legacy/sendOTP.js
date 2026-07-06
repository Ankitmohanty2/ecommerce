/**
 * LEGACY — Firebase phone OTP (commented out, not used).
 * Active auth uses email + password with backend email OTP.
 */
/*
import "../adapters/firebase";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const sendOtp = async (phoneNumber) => {
  const auth = getAuth();
  phoneNumber = "+91" + phoneNumber;
  window.recaptchaVerifier = new RecaptchaVerifier(
    "sign-in-button",
    {
      size: "invisible",
      callback: (response) => {},
      defaultCountry: "IN",
    },
    auth
  );
  const appVerifier = window.recaptchaVerifier;
  const confirmationResult = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    appVerifier
  );
  return confirmationResult;
};

export default sendOtp;
*/

export {};
