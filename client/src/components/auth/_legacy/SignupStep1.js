import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "../../adapters/axios";

import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@material-ui/core/CircularProgress";

import { setAuthEmail, setIsLogin } from "../../actions/userActions";
import toastMessage from "../../utils/toastMessage";

function SignupStep1({ handleActions }) {
  const [emailState, setEmailState] = useState({
    value: "",
    isError: false,
    errorMsg: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const initial = useRef(true);
  const dispatch = useDispatch();

  const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return;
    }
    if (!emailState.isError) {
      submitEmail();
    }
  }, [submitCount]);

  const submitEmail = async () => {
    setLoading(true);
    try {
      const email = emailState.value.trim().toLowerCase();
      const res = await axios.post("/accounts/check-email", { email });
      if (res.data.isExist) {
        toastMessage("You are already registered. Please login.", "info");
        return;
      }

      dispatch(setAuthEmail(email));
      handleActions({
        openStep1: false,
        openStep2: false,
        openEmailVerify: true,
      });
    } catch (error) {
      toastMessage("Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    if (email === "") {
      return { isError: true, errorMsg: "Email cannot be empty" };
    }
    if (!regEmail.test(email.trim())) {
      return { isError: true, errorMsg: "Please enter a valid email address" };
    }
    return { isError: false, errorMsg: "" };
  };

  const onSubmit = () => {
    const { isError, errorMsg } = validateEmail(emailState.value);
    setEmailState({ ...emailState, isError, errorMsg });
    setSubmitCount((cnt) => cnt + 1);
  };

  return (
    <div className="auth-form">
      <h2 className="auth-form__heading">Create your account</h2>
      <p className="auth-form__hint">
        Enter your email. We&apos;ll send a 6-digit verification code.
      </p>

      <TextField
        variant="outlined"
        error={emailState.isError}
        label="Email address"
        type="email"
        className="auth-form__field"
        InputProps={{
          startAdornment: <InputAdornment position="start">@</InputAdornment>,
        }}
        onChange={(e) =>
          setEmailState({
            value: e.target.value,
            isError: false,
            errorMsg: "",
          })
        }
        value={emailState.value}
        name="email"
        helperText={emailState.isError ? emailState.errorMsg : ""}
      />

      <p className="auth-form__legal">
        By continuing, you agree to Vixen Fashion&apos;s Terms of Use and Privacy Policy.
      </p>

      <div className="auth-form__actions">
        <button
          type="button"
          className="auth-btn auth-btn--primary"
          disabled={loading}
          onClick={onSubmit}
        >
          {loading ? (
            <CircularProgress size={22} className="auth-btn__spinner" />
          ) : (
            "Send verification code"
          )}
        </button>
      </div>

      <p className="auth-switch">
        Already have an account?
        <a
          className="auth-switch__link"
          role="button"
          tabIndex={0}
          onClick={() => dispatch(setIsLogin(true))}
          onKeyDown={(e) => e.key === "Enter" && dispatch(setIsLogin(true))}
        >
          Login
        </a>
      </p>
    </div>
  );
}

export default SignupStep1;
