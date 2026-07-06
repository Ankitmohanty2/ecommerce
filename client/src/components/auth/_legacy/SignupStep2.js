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
import { modalClose, setIsAuthenticate, setUserInfo } from "../../actions/userActions";
import useQuery from "../../hooks/useQuery";
import { makeCapitalizeText } from "../../utils/makeCapitalizeText";

function SignupStep2() {
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({ fName: "", lName: "", password: "" });
  const [errors, setErrors] = useState({ fName: false, lName: false, password: false });
  const [errorMsg, setErrorMsg] = useState({ fName: "", lName: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const initial = useRef(true);

  const { authEmail, popupLogin } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const history = useHistory();
  const query = useQuery();

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
  }, [submitCount]);

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
      await axios.post("/accounts/signup", {
        fname: makeCapitalizeText(values.fName),
        lname: makeCapitalizeText(values.lName),
        password: values.password,
        email: authEmail,
      });

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
    } catch (error) {
      if (error?.response?.data?.message === "email-not-verified") {
        toastMessage("Please verify your email first.", "info");
      } else {
        toastMessage("Something went wrong. Please try again later.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputs = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const submitForm = () => {
    const validatedFName = validateName(values.fName, "First name");
    const validatedLName = validateName(values.lName, "Last name");
    const validatedPassword = validatePassword(values.password);

    setErrorMsg({
      fName: validatedFName.errorMsg,
      lName: validatedLName.errorMsg,
      password: validatedPassword.errorMsg,
    });
    setErrors({
      fName: validatedFName.isError,
      lName: validatedLName.isError,
      password: validatedPassword.isError,
    });
    setSubmitCount((cnt) => cnt + 1);
  };

  return (
    <div className="auth-form">
      <h2 className="auth-form__heading">Almost there</h2>
      <p className="auth-form__hint">
        Verified <strong>{authEmail}</strong>. Set your name and password to finish.
      </p>

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
    </div>
  );
}

export default SignupStep2;
