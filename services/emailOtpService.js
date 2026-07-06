/**
 * DISABLED — Email OTP service (not used while auth is email + password only).
 * Re-enable with routes in routes/router.js and user-controller.js.
 */
const nodemailer = require("nodemailer");

const OTP_TTL_MS = 10 * 60 * 1000;
const otpStore = new Map();

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

const sendOtpEmail = async (email, otp, purpose = "signup") => {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const subject =
    purpose === "login"
      ? "Your Vixen Fashion login code"
      : "Verify your Vixen Fashion email";

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px">
      <h2 style="color:#142536;margin:0 0 12px">Vixen Fashion</h2>
      <p style="color:#5a6775;line-height:1.6">Your verification code is:</p>
      <p style="font-size:32px;font-weight:700;letter-spacing:8px;color:#142536;margin:16px 0">${otp}</p>
      <p style="color:#8a96a3;font-size:13px">This code expires in 10 minutes. Do not share it with anyone.</p>
    </div>
  `;

  if (!transporter) {
    console.log(`[email-otp][dev] ${email} → ${otp} (${purpose})`);
    return { devMode: true };
  }

  await transporter.sendMail({
    from,
    to: email,
    subject,
    html,
  });

  return { devMode: false };
};

const storeOtp = (email, otp, purpose) => {
  otpStore.set(normalizeEmail(email), {
    otp,
    purpose,
    expiresAt: Date.now() + OTP_TTL_MS,
    verified: false,
  });
};

const sendEmailOtp = async (email, purpose = "signup") => {
  const normalized = normalizeEmail(email);
  const otp = generateOtp();
  storeOtp(normalized, otp, purpose);
  const mailResult = await sendOtpEmail(normalized, otp, purpose);
  return { email: normalized, ...mailResult, otp: mailResult.devMode ? otp : undefined };
};

const verifyEmailOtp = (email, otp, purpose = "signup") => {
  const normalized = normalizeEmail(email);
  const record = otpStore.get(normalized);

  if (!record) {
    return { ok: false, reason: "not-found" };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalized);
    return { ok: false, reason: "expired" };
  }

  if (record.purpose !== purpose) {
    return { ok: false, reason: "invalid-purpose" };
  }

  if (String(record.otp) !== String(otp)) {
    return { ok: false, reason: "invalid-code" };
  }

  record.verified = true;
  record.verifiedAt = Date.now();
  otpStore.set(normalized, record);
  return { ok: true };
};

const isEmailOtpVerified = (email, purpose = "signup") => {
  const normalized = normalizeEmail(email);
  const record = otpStore.get(normalized);
  return Boolean(
    record &&
      record.verified &&
      record.purpose === purpose &&
      Date.now() <= record.expiresAt + OTP_TTL_MS
  );
};

const clearEmailOtp = (email) => {
  otpStore.delete(normalizeEmail(email));
};

module.exports = {
  sendEmailOtp,
  verifyEmailOtp,
  isEmailOtpVerified,
  clearEmailOtp,
  normalizeEmail,
};
