import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "../../adapters/axios";

import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import CircularProgress from "@material-ui/core/CircularProgress";

import useQuery from "../../hooks/useQuery";
import {
  modalClose,
  setIsAuthenticate,
  setIsLogin,
  setUserInfo,
} from "../../actions/userActions";
import toastMessage from "../../utils/toastMessage";
import authentication from "../../adapters/authentication";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: false, password: false });
  const [errorMsg, setErrorMsg] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const initial = useRef(true);
  const dispatch = useDispatch();
  const history = useHistory();
  const query = useQuery();
  const { popupLogin } = useSelector((state) => state.userReducer);

  const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return;
    }
    const hasError = Object.values(errors).some(Boolean);
    if (!hasError) {
      completeLogin();
    }
  }, [submitCount]); // eslint-disable-line react-hooks/exhaustive-deps

  const validateEmail = (email) => {
    if (email === "") {
      return { isError: true, errorMsg: "Email cannot be empty" };
    }
    if (!regEmail.test(email.trim())) {
      return { isError: true, errorMsg: "Please enter a valid email address" };
    }
    return { isError: false, errorMsg: "" };
  };

  const validatePassword = (pass) => {
    if (pass === "") {
      return { isError: true, errorMsg: "Password cannot be empty" };
    }
    if (pass.length < 6) {
      return { isError: true, errorMsg: "Minimum 6 characters required" };
    }
    if (pass.length > 20) {
      return { isError: true, errorMsg: "Maximum 20 characters allowed" };
    }
    return { isError: false, errorMsg: "" };
  };

  const handleInputs = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const completeLogin = async () => {
    setLoading(true);
    try {
      const email = values.email.trim().toLowerCase();
      const res = await axios.post("/accounts/check-email", { email });
      if (!res.data.isExist) {
        setLoading(false);
        toastMessage("No account found. Please create an account.", "info");
        return;
      }

      await axios.post("/accounts/login", { email, password: values.password });

      const { isAuth, user } = await authentication();
      dispatch(setIsAuthenticate(isAuth));
      dispatch(setUserInfo(user));

      if (popupLogin) {
        dispatch(modalClose());
      }

      if (query.get("ref")) {
        const params = new URLSearchParams();
        if (query.get("init") === "true") params.set("init", "true");
        const qs = params.toString();
        history.replace(`/${query.get("ref")}${qs ? `?${qs}` : ""}`);
      } else {
        history.replace("/");
      }
    } catch (error) {
      setLoading(false);
      if (error?.message === "login/invalid-email-or-password") {
        toastMessage("Invalid email or password.", "info");
      } else {
        toastMessage("Something went wrong. Please try again later.", "error");
      }
    }
  };

  const onLoginClick = () => {
    const validatedEmail = validateEmail(values.email);
    const validatedPassword = validatePassword(values.password);
    setErrorMsg({
      email: validatedEmail.errorMsg,
      password: validatedPassword.errorMsg,
    });
    setErrors({
      email: validatedEmail.isError,
      password: validatedPassword.isError,
    });
    setSubmitCount((cnt) => cnt + 1);
  };

  return (
    <div className="auth-form">
      <h2 className="auth-form__heading">Login to your account</h2>
      <p className="auth-form__hint">Enter your email and password to continue.</p>

      <TextField
        variant="outlined"
        error={errors.email}
        label="Email address"
        type="email"
        className="auth-form__field"
        onChange={handleInputs}
        value={values.email}
        name="email"
        helperText={errors.email ? errorMsg.email : ""}
        InputProps={{
          startAdornment: <InputAdornment position="start">@</InputAdornment>,
        }}
      />

      <TextField
        variant="outlined"
        error={errors.password}
        label="Password"
        type={showPassword ? "text" : "password"}
        className="auth-form__field"
        onChange={handleInputs}
        value={values.password}
        name="password"
        helperText={errors.password ? errorMsg.password : ""}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <p className="auth-form__legal">
        By continuing, you agree to Vixen Fashion&apos;s Terms of Use and Privacy Policy.
      </p>

      <div className="auth-form__actions">
        <button
          type="button"
          className="auth-btn auth-btn--primary"
          disabled={loading}
          onClick={onLoginClick}
        >
          {loading ? (
            <CircularProgress size={22} className="auth-btn__spinner" />
          ) : (
            "Login"
          )}
        </button>
      </div>

      <p className="auth-switch">
        New to Vixen?
        <button
          type="button"
          className="auth-switch__link"
          onClick={() => dispatch(setIsLogin(false))}
        >
          Create an account
        </button>
      </p>
    </div>
  );
}

export default Login;

/*
 * ── Disabled auth methods (re-enable later) ──
 *
 * Email OTP login:
 * - import EmailOTPVerify from "./EmailOTPVerify";
 * - loginWithEmailOtp() + "Login with email OTP" button
 *
 * Phone / Firebase:
 * - client/src/utils/_legacy/sendOTP.js
 * - client/src/components/auth/_legacy/OTPVerify.phone.js
 *
 * Email OTP backend:
 * - services/emailOtpService.js
 * - POST /accounts/send-email-otp
 * - POST /accounts/verify-email-otp
 */
