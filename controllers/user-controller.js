const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Email OTP disabled for now — see services/emailOtpService.js
// const {
//   sendEmailOtp,
//   verifyEmailOtp,
//   isEmailOtpVerified,
//   clearEmailOtp,
//   normalizeEmail,
// } = require("../services/emailOtpService");

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const signup = async (req, res) => {
  const email = normalizeEmail(req.body.email);

  // OTP check disabled — re-enable when email verification is turned on
  // if (!isEmailOtpVerified(email, "signup")) {
  //   return res.status(400).json({ code: 400, message: "email-not-verified" });
  // }

  const payload = {
    ...req.body,
    email,
  };
  const user = new User(payload);
  try {
    const token = await user.generateAuthToken();
    await user.save();
    // clearEmailOtp(email);
    res.cookie("auth_token", token, {
      maxAge: 2629800000,
      httpOnly: true,
    });
    res.status(201).json({ code: 201, isComplete: true });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ code: 400, message: "invalid data or invalid syntax" });
  }
};

const isExistEmail = async (req, res) => {
  const email = normalizeEmail(req.body.email);
  try {
    const result = await User.findOne({ email });
    if (result) {
      res.json({ code: 200, isExist: true });
    } else {
      res.send({ code: 200, isExist: false });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ code: 400, message: "Couldn't understand request" });
  }
};

const isExistPhone = async (req, res) => {
  const phoneNumber = req.body.phone;
  try {
    const result = await User.findOne({ phone: phoneNumber });
    if (result) {
      res.json({ code: 200, isExist: true });
    } else {
      res.send({ code: 200, isExist: false });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ code: 400, message: "Couldn't understand request" });
  }
};

const authentication = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    if (token) {
      const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
      const userInfo = await User.findOne(
        { _id: verifyToken._id, "tokens.token": token },
        { password: 0, tokens: 0 }
      );

      const user = userInfo._doc;

      res.status(200).json({
        code: 200,
        isAuthenticate: true,
        user: {
          ...user,
          _id: user._id.toString(),
        },
      });
    } else {
      res.status(401).json({
        code: 401,
        isAuthenticate: false,
        message: "invalid provided token. Test",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      code: 401,
      isAuthenticate: false,
      message: "invalid provided token.",
    });
  }
};

const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;
    const userLogin = await User.findOne({ email });
    if (!userLogin) {
      return res
        .status(401)
        .json({ isLogin: false, message: "login/invalid-email-or-password" });
    }
    const isMatch = await bcrypt.compare(password, userLogin.password);
    if (isMatch) {
      const token = await userLogin.generateAuthToken();
      res.cookie("auth_token", token, {
        maxAge: 2629800000,
        httpOnly: true,
      });
      res.json({ isLogin: true, message: "User Login Successfully" });
    } else {
      res
        .status(401)
        .json({ isLogin: false, message: "login/invalid-email-or-password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ isLogin: false, error: error });
  }
};

const loginWithEmail = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    // OTP check disabled — re-enable when email verification is turned on
    // if (!isEmailOtpVerified(email, "login")) {
    //   return res.status(401).json({ isLogin: false, message: "email-not-verified" });
    // }

    const userLogin = await User.findOne({ email });
    if (!userLogin) {
      return res.status(401).json({ isLogin: false });
    }
    const token = await userLogin.generateAuthToken();
    // clearEmailOtp(email);
    res.cookie("auth_token", token, {
      maxAge: 2629800000,
      httpOnly: true,
    });
    res.json({ isLogin: true, message: "User Login Successfully" });
  } catch (error) {
    res.status(500).json({ isLogin: false, error: error });
  }
};

const loginWithMobileNumber = async (req, res) => {
  try {
    const { phone } = req.body;
    const userLogin = await User.findOne({ phone: phone });
    if (!userLogin) {
      return res.status(401).json({ isLogin: false });
    }
    const token = await userLogin.generateAuthToken();
    res.cookie("auth_token", token, {
      maxAge: 2629800000,
      httpOnly: true,
    });
    res.json({ isLogin: true, message: "User Login Successfully" });
  } catch (error) {
    res.status(500).json({ isLogin: false, error: error });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    if (token) {
      const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
      const userInfo = await User.findOne({ _id: verifyToken._id });

      userInfo.tokens = userInfo.tokens.filter(
        (dbToken) => dbToken.token !== token
      );

      await userInfo.save();
      res.clearCookie("auth_token", { path: "/" });

      res.status(200).json({
        code: 200,
        isLogout: true,
      });
    } else {
      res.status(401).json({
        code: 401,
        isLogout: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      isLogout: false,
    });
  }
};

const updateUserInfo = async (req, res) => {
  const { id, fname, lname, gender } = req.body;
  try {
    await User.updateOne({ _id: id }, { fname, lname, gender });
    res.status(200).json({
      isUpdated: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      isUpdated: false,
    });
  }
};

const updateEmail = async (req, res) => {
  const { id, email } = req.body;
  try {
    await User.updateOne({ _id: id }, { email: normalizeEmail(email) });
    res.status(200).json({
      isUpdated: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      isUpdated: false,
    });
  }
};

// ── Email OTP (disabled — uncomment routes in router.js to re-enable) ──
/*
const sendOtpToEmail = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const purpose = req.body.purpose === "login" ? "login" : "signup";

    if (!email) {
      return res.status(400).json({ code: 400, message: "email-required" });
    }

    if (purpose === "signup") {
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(409).json({ code: 409, message: "email-already-exists" });
      }
    }

    if (purpose === "login") {
      const exists = await User.findOne({ email });
      if (!exists) {
        return res.status(404).json({ code: 404, message: "email-not-found" });
      }
    }

    const { sendEmailOtp } = require("../services/emailOtpService");
    const result = await sendEmailOtp(email, purpose);
    res.status(200).json({
      code: 200,
      sent: true,
      email: result.email,
      devOtp: result.otp || undefined,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: 500, message: "otp-send-failed" });
  }
};

const verifyOtpForEmail = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { otp } = req.body;
    const purpose = req.body.purpose === "login" ? "login" : "signup";
    const { verifyEmailOtp } = require("../services/emailOtpService");

    const result = verifyEmailOtp(email, otp, purpose);
    if (!result.ok) {
      const messages = {
        "not-found": "No OTP found. Please request a new code.",
        expired: "OTP expired. Please request a new code.",
        "invalid-code": "Invalid OTP. Please try again.",
        "invalid-purpose": "Invalid verification request.",
      };
      return res.status(400).json({
        code: 400,
        message: result.reason,
        error: messages[result.reason] || "Verification failed",
      });
    }

    res.status(200).json({ code: 200, verified: true, email });
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: 500, message: "otp-verify-failed" });
  }
};
*/

module.exports = {
  signup,
  login,
  logout,
  loginWithEmail,
  loginWithMobileNumber,
  isExistEmail,
  isExistPhone,
  authentication,
  updateUserInfo,
  updateEmail,
  // sendOtpToEmail,
  // verifyOtpForEmail,
};
