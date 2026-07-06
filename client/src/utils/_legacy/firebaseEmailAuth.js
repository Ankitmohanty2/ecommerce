/**
 * LEGACY — Firebase email sign-in link (commented out, not used).
 * Active auth uses backend 6-digit email OTP via nodemailer.
 */
/*
import "../adapters/firebase";
import {
  getAuth,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from "firebase/auth";

const EMAIL_STORAGE_KEY = "vixenEmailForSignIn";

export const sendEmailSignInLink = async (email) => {
  const auth = getAuth();
  const normalizedEmail = email.trim().toLowerCase();
  const actionCodeSettings = {
    url: `${window.location.origin}/login?mode=emailLink`,
    handleCodeInApp: true,
  };
  window.localStorage.setItem(EMAIL_STORAGE_KEY, normalizedEmail);
  await sendSignInLinkToEmail(auth, normalizedEmail, actionCodeSettings);
  return normalizedEmail;
};

export const completeEmailLinkSignIn = async (emailOverride) => {
  const auth = getAuth();
  if (!isSignInWithEmailLink(auth, window.location.href)) return null;
  let email = emailOverride || window.localStorage.getItem(EMAIL_STORAGE_KEY);
  const result = await signInWithEmailLink(auth, email, window.location.href);
  window.localStorage.removeItem(EMAIL_STORAGE_KEY);
  return { user: result.user, email };
};
*/

export {};
