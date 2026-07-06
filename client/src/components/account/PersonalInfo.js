import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../adapters/axios";
import {
  Box,
  Button,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

import { updateEmail, updateUserInfo } from "../../actions/userActions";
import toastMessage from "../../utils/toastMessage";

import { makeCapitalizeText } from "../../utils/makeCapitalizeText";
import "../../styles/AccountPage.css";

const useStyles = makeStyles((theme) => ({
  component: {
    padding: "30px 40px 0 40px",
  },
  form: {
    display: "flex",
    alignItems: "flex-start",
    margin: "20px 0",
  },
  saveBtn: {
    width: "150px",
    padding: "12px",
    color: "rgb(255, 255, 255)",
    borderRadius: "3px",
    fontSize: "16px",
    boxShadow: "none",
  },
  input: {
    width: "270px",
    fontSize: "14px",
    outline: "none",
    borderRadius: "2px",
    boxShadow: "none",
    marginRight: 10,
  },
  title: {
    fontSize: "18px",
    fontWeight: 600,
    paddingRight: "24px",
    display: "inline-block",
  },
  editLink: {
    display: "inline-block",
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--accent)",
    cursor: "pointer",
  },
}));

function PersonalInfo() {
  const [isEditPInfo, setIsEditPInfo] = useState(false);
  const [isEditEmail, setIsEditEmail] = useState(false);
  const { user } = useSelector((state) => state.userReducer);

  const [values, setValues] = useState({
    fname: user.fname,
    lname: user.lname,
    gender: user.gender,
    phone: user.phone,
    email: user.email,
  });

  const [errors, setErrors] = useState({
    fname: false,
    lname: false,
    email: false,
    phone: false,
  });

  const [errorMsg, setErrorMsg] = useState({
    fName: "",
    lName: "",
    phone: "",
    email: "",
  });

  //hooks
  const classes = useStyles();
  const initial = useRef(true);
  const dispatch = useDispatch();

  //Save Counter
  const [saveCountPInfo, setSaveCountPInfo] = useState(0);
  const [saveCountEmail, setSaveCountEmail] = useState(0);

  useEffect(() => {
    if (initial.current === false) {
      if (!errors.fname && !errors.lname) {
        axios
          .patch("/accounts/update-user-info", {
            id: user._id,
            fname: makeCapitalizeText(values.fname),
            lname: makeCapitalizeText(values.lname),
            gender: values.gender,
          })
          .then(() => {
            dispatch(
              updateUserInfo(
                makeCapitalizeText(values.fname),
                makeCapitalizeText(values.lname),
                values.gender
              )
            );
            toastMessage("Account details updated !", "success");
          })
          .catch((e) => {
            toastMessage("Something went wrong.", "error");
          });
        setIsEditPInfo(false);
      }
    }
  }, [saveCountPInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (initial.current === true) {
      initial.current = false;
    } else {
      if (!errors.email) {
        axios
          .patch("/accounts/update-email", {
            id: user._id,
            email: values.email,
          })
          .then(() => {
            dispatch(updateEmail(values.email));
            toastMessage("Email Address updated !", "success");
          })
          .catch((e) => {
            toastMessage("Something went wrong.", "error");
          });
        setIsEditEmail(false);
      }
    }
  }, [saveCountEmail]); // eslint-disable-line react-hooks/exhaustive-deps

  //reg for name

  const regName = /^[a-zA-Z]+$/;
  const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateName = (name, fieldName) => {
    if (name === "") {
      return {
        isError: true,
        errorMsg: `${fieldName} can not be empty`,
      };
    } else if (name.length < 3) {
      return {
        isError: true,
        errorMsg: "Minimum 3 charterers required",
      };
    } else if (name.length > 20) {
      return {
        isError: true,
        errorMsg: "Maximum 20 charterers allowed",
      };
    } else if (!regName.test(name)) {
      return {
        isError: true,
        errorMsg: `Invalid ${fieldName}`,
      };
    } else {
      return {
        isError: false,
        errorMsg: "",
      };
    }
  };

  const validateEmail = (email) => {
    if (email === "") {
      return {
        isError: true,
        errorMsg: `Email address can not be empty`,
      };
    } else if (!regEmail.test(email)) {
      return {
        isError: true,
        errorMsg: `Please enter valid email`,
      };
    } else {
      return {
        isError: false,
        errorMsg: "",
      };
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const savePersonalInfo = () => {
    const validatedFName = validateName(values.fname, "First Name");
    const validatedLName = validateName(values.lname, "Last Name");

    //Set Error
    setErrorMsg({
      ...errorMsg,
      fname: validatedFName.errorMsg,
      lname: validatedLName.errorMsg,
    });

    setErrors({
      ...errors,
      fname: validatedFName.isError,
      lname: validatedLName.isError,
    });
    setSaveCountPInfo((cnt) => cnt + 1);
    //checkout useEffect
  };

  const saveEmail = () => {
    const validatedEmail = validateEmail(values.email);

    //Set Error
    setErrorMsg({
      ...errorMsg,
      email: validatedEmail.errorMsg,
    });

    setErrors({
      ...errors,
      email: validatedEmail.isError,
    });
    setSaveCountEmail((cnt) => cnt + 1);
    //checkout useEffect
  };

  return (
    <div className="account-panel">
      <header className="account-panel__header">
        <h1 className="account-panel__title">Profile Information</h1>
        <p className="account-panel__subtitle">
          Manage your personal details and contact information
        </p>
      </header>

      <Box className={classes.component} style={{ padding: 0 }}>
        <Typography className={classes.title}>Personal Information</Typography>
        <span
          className={classes.editLink}
          onClick={() => setIsEditPInfo(!isEditPInfo)}
        >
          {isEditPInfo ? "Cancel" : "Edit"}
        </span>
        <Box className={classes.form}>
          <TextField
            label={isEditPInfo ? "First Name" : ""}
            placeholder="First Name"
            variant="outlined"
            className={classes.input}
            value={values.fname}
            name="fname"
            disabled={!isEditPInfo}
            onChange={handleChange}
            error={errors.fname}
            helperText={errors.fname && isEditPInfo && `${errorMsg.fname}`}
          />
          <TextField
            label={isEditPInfo ? "Last Name" : ""}
            placeholder="Last Name"
            variant="outlined"
            className={classes.input}
            value={values.lname}
            name="lname"
            disabled={!isEditPInfo}
            onChange={handleChange}
            error={errors.lname}
            helperText={errors.lname && isEditPInfo && `${errorMsg.lname}`}
          />
          {isEditPInfo && (
            <Button
              variant="contained"
              className={classes.saveBtn}
              style={{ background: "#142536" }}
              onClick={savePersonalInfo}
            >
              SAVE
            </Button>
          )}
        </Box>
        <FormControl component="fieldset">
          <Typography style={{ fontSize: 14 }}>Your Gender</Typography>
          <RadioGroup
            row
            aria-label="gender"
            name="gender"
            value={values.gender}
            onChange={handleChange}
          >
            <FormControlLabel
              value="M"
              control={<Radio style={{ color: "var(--accent)" }} />}
              label="Male"
              disabled={!isEditPInfo}
            />
            <FormControlLabel
              value="F"
              control={<Radio style={{ color: "var(--accent)" }} />}
              label="Female"
              disabled={!isEditPInfo}
            />
          </RadioGroup>
        </FormControl>
        <br />
        <Typography className={classes.title} style={{ marginTop: 50 }}>
          Email Address
        </Typography>
        <span
          className={classes.editLink}
          onClick={() => setIsEditEmail(!isEditEmail)}
        >
          {isEditEmail ? "Cancel" : "Edit"}
        </span>

        <Box className={classes.form}>
          <TextField
            label={isEditEmail ? "Email Address" : ""}
            variant="outlined"
            className={classes.input}
            value={values.email}
            name="email"
            placeholder="Email Address"
            disabled={!isEditEmail}
            onChange={handleChange}
            error={errors.email}
            helperText={errors.email && isEditEmail && `${errorMsg.email}`}
          />
          {isEditEmail && (
            <Button
              variant="contained"
              className={classes.saveBtn}
              style={{ background: "#142536" }}
              onClick={saveEmail}
            >
              SAVE
            </Button>
          )}
        </Box>
        <br />
        <Typography className={classes.title} style={{ marginTop: 10 }}>
          Mobile Number
        </Typography>
        {/* <span
          className={classes.editLink}
          onClick={() => setIsEditEmail(!isEditEmail)}
        >
          {isEditEmail ? "Cancel" : "Edit"}
        </span> */}

        <Box className={classes.form}>
          <TextField
            /*  label={isEditEmail ? "Email Address" : ""} */
            variant="outlined"
            disabled
            className={classes.input}
            name="phone"
            value={values.phone}
            /*    disabled={!isEditEmail} */
          />
          {/*  {isEditEmail && (
            <Button
              variant="contained"
              className={classes.saveBtn}
              style={{ background: "#142536" }}
            >
              SAVE
            </Button>
          )} */}
        </Box>
      <p className="auth-form__legal" style={{ marginTop: 24, fontSize: "0.82rem", color: "#8a96a3" }}>
        When you update your email, your login credentials change. Your order history and saved details stay intact.
      </p>
      </Box>
    </div>
  );
}

export default PersonalInfo;
