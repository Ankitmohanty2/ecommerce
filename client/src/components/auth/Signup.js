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

import toastMessage from "../../utils/toastMessage";
import authentication from "../../adapters/authentication";
import {
  modalClose,
  setIsAuthenticate,
  setIsLogin,
  setUserInfo,
} from "../../actions/userActions";
import useQuery from "../../hooks/useQuery";
import { makeCapitalizeText } from "../../utils/makeCapitalizeText";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    email: "",
    fName: "",
    lName: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: false,
    fName: false,
    lName: false,
    password: false,
  });
  const [errorMsg, setErrorMsg] = useState({
    email: "",
    fName: "",
    lName: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const initial = useRef(true);

  const dispatch = useDispatch();
  const history = useHistory();
  const query = useQuery();
  const { popupLogin } = useSelector((state) => state.userReducer);

  const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regName = /^[a-zA-Z]+$/;
  const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,20}$/;

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return;
    }
    const hasError = Object.values(errors).some(Boolean);
    if (!hasError) {
      completeSignup();
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

  const validateName = (name, fieldName) => {
    if (name === "") {
      return { isError: true, errorMsg: `${fieldName} cannot be empty` };
    }
    if (name.length < 3) {
      return { isError: true, errorMsg: "Minimum 3 characters required" };
    }
    if (name.length > 20) {
      return { isError: true, errorMsg: "Maximum 20 characters allowed" };
    }
    if (!regName.test(name)) {
      return { isError: true, errorMsg: `Invalid ${fieldName}` };
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
    if (!regPassword.test(pass)) {
      return { isError: true, errorMsg: "Use upper, lower, number & 6+ chars" };
    }
    return { isError: false, errorMsg: "" };
  };

  const completeSignup = async () => {
    setLoading(true);
    try {
      const email = values.email.trim().toLowerCase();
      const exists = await axios.post("/accounts/check-email", { email });
      if (exists.data.isExist) {
        toastMessage("An account with this email already exists. Please login.", "info");
        setLoading(false);
        return;
      }

      await axios.post("/accounts/signup", {
        fname: makeCapitalizeText(values.fName),
        lname: makeCapitalizeText(values.lName),
        password: values.password,
        email,
      });

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
      toastMessage("Something went wrong. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputs = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const submitForm = () => {
    const validatedEmail = validateEmail(values.email);
    const validatedFName = validateName(values.fName, "First name");
    const validatedLName = validateName(values.lName, "Last name");
    const validatedPassword = validatePassword(values.password);

    setErrorMsg({
      email: validatedEmail.errorMsg,
      fName: validatedFName.errorMsg,
      lName: validatedLName.errorMsg,
      password: validatedPassword.errorMsg,
    });
    setErrors({
      email: validatedEmail.isError,
      fName: validatedFName.isError,
      lName: validatedLName.isError,
      password: validatedPassword.isError,
    });
    setSubmitCount((cnt) => cnt + 1);
  };

  return (
    <div className="auth-form">
      <h2 className="auth-form__heading">Create your account</h2>
      <p className="auth-form__hint">
        Enter your email, name and password to get started.
      </p>

      <TextField
        variant="outlined"
        label="Email address"
        type="email"
        className="auth-form__field"
        value={values.email}
        onChange={handleInputs}
        name="email"
        error={errors.email}
        helperText={errors.email ? errorMsg.email : ""}
        InputProps={{
          startAdornment: <InputAdornment position="start">@</InputAdornment>,
        }}
      />

      <div className="auth-form__row">
        <TextField
          variant="outlined"
          label="First name"
          className="auth-form__field"
          value={values.fName}
          onChange={handleInputs}
          name="fName"
          error={errors.fName}
          helperText={errors.fName ? errorMsg.fName : ""}
        />
        <TextField
          variant="outlined"
          label="Last name"
          className="auth-form__field"
          value={values.lName}
          onChange={handleInputs}
          name="lName"
          error={errors.lName}
          helperText={errors.lName ? errorMsg.lName : ""}
        />
      </div>

      <TextField
        variant="outlined"
        label="Password"
        type={showPassword ? "text" : "password"}
        className="auth-form__field"
        onChange={handleInputs}
        value={values.password}
        name="password"
        error={errors.password}
        helperText={
          errors.password
            ? errorMsg.password
            : "Min 6 chars with uppercase, lowercase & number"
        }
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
          onClick={submitForm}
        >
          {loading ? (
            <CircularProgress size={22} className="auth-btn__spinner" />
          ) : (
            "Create account"
          )}
        </button>
      </div>

      <p className="auth-switch">
        Already have an account?
        <button
          type="button"
          className="auth-switch__link"
          onClick={() => dispatch(setIsLogin(true))}
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default Signup;

/*
 * ── Email OTP signup flow (disabled — re-enable later) ──
 * See: client/src/components/auth/_legacy/EmailOTPVerify.js
 *      client/src/components/auth/_legacy/SignupStep1.js
 *      client/src/components/auth/_legacy/SignupStep2.js
 *      client/src/utils/_legacy/emailOtp.js
 */
