/** DISABLED — Email OTP UI. Re-enable when OTP verification is turned back on. */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import OtpInput from "react-otp-input";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "../../adapters/axios";

import toastMessage from "../../utils/toastMessage";
import authentication from "../../adapters/authentication";
import useQuery from "../../hooks/useQuery";
import { sendEmailOtp, verifyEmailOtp } from "../../utils/emailOtp";
import { modalClose, setIsAuthenticate, setUserInfo } from "../../actions/userActions";

function EmailOTPVerify({
  handleActions,
  email,
  setIsLoginComponent,
  source = "signup",
}) {
  const [otp, setOTP] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { popupLogin } = useSelector((state) => state.userReducer);

  const dispatch = useDispatch();
  const history = useHistory();
  const query = useQuery();

  useEffect(() => {
    handleSendOtp();
  }, []);

  const handleSendOtp = async () => {
    setSending(true);
    try {
      const { data } = await sendEmailOtp(email, source);
      toastMessage(`Verification code sent to ${email}`, "success");
      if (data.devOtp) {
        console.info(`[dev email otp] ${email}: ${data.devOtp}`);
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      if (msg === "email-already-exists") {
        toastMessage("This email is already registered. Please login.", "info");
      } else if (msg === "email-not-found") {
        toastMessage("No account found with this email.", "info");
      } else {
        toastMessage("Could not send verification code.", "error");
      }
    } finally {
      setSending(false);
    }
  };

  const finishLogin = async () => {
    await axios.post("/accounts/login-with-email", { email });
    const { isAuth, user } = await authentication();
    dispatch(setIsAuthenticate(isAuth));
    dispatch(setUserInfo(user));

    if (popupLogin) {
      dispatch(modalClose());
    }

    if (query.get("ref")) {
      history.replace(`/${query.get("ref")}`);
    } else {
      history.replace("/");
    }
  };

  const handleVerify = async () => {
    if (otp.length < 6) {
      toastMessage("Please enter the 6-digit code", "info");
      return;
    }

    setVerifying(true);
    try {
      await verifyEmailOtp(email, otp, source);

      if (source === "signup") {
        handleActions({
          openStep1: false,
          openStep2: true,
          openEmailVerify: false,
        });
        toastMessage("Email verified successfully", "success");
      } else {
        await finishLogin();
      }
    } catch (error) {
      toastMessage(
        error?.response?.data?.error || "Invalid or expired code. Try again.",
        "info"
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleChangeEmail = () => {
    if (source === "signup") {
      handleActions({
        openStep1: true,
        openStep2: false,
        openEmailVerify: false,
      });
    } else if (setIsLoginComponent) {
      setIsLoginComponent(true);
    }
  };

  return (
    <div className="auth-otp">
      <h2 className="auth-form__heading">Verify your email</h2>
      <p className="auth-form__hint">
        Enter the 6-digit code sent to <strong>{email}</strong>
        <a
          className="auth-form__hint-link"
          role="button"
          tabIndex={0}
          onClick={handleChangeEmail}
          onKeyDown={(e) => e.key === "Enter" && handleChangeEmail()}
        >
          Change
        </a>
      </p>

      <div className="auth-otp__inputs">
        <OtpInput
          value={otp}
          onChange={setOTP}
          numInputs={6}
          renderSeparator={null}
          renderInput={(props) => (
            <input {...props} className="auth-otp__input" inputMode="numeric" />
          )}
        />
      </div>

      <div className="auth-form__actions">
        <button
          type="button"
          className="auth-btn auth-btn--primary"
          disabled={verifying}
          onClick={handleVerify}
        >
          {verifying ? (
            <CircularProgress size={22} className="auth-btn__spinner" />
          ) : (
            "Verify & continue"
          )}
        </button>

        <button
          type="button"
          className="auth-btn auth-btn--ghost"
          disabled={sending}
          onClick={handleSendOtp}
        >
          {sending ? (
            <CircularProgress size={22} className="auth-btn__spinner" />
          ) : (
            "Resend code"
          )}
        </button>
      </div>
    </div>
  );
}

export default EmailOTPVerify;
