import bcrypt from "bcrypt";
import User from "../models/User.js";
import OtpToken from "../models/OtpToken.js";
import PasswordResetToken from "../models/PasswordResetToken.js";
import { getCollegeFromEmail } from "../constants/colleges.js";
import { generateAccessToken, generateRefreshToken } from "../config/jwt.js";
import { sendEmail } from "../config/email.js";
import {
  signupOtpTemplate,
  passwordResetOtpTemplate
} from "../utils/emailTemplates.js";

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const college = getCollegeFromEmail(email);
    if (!college) {
      return res
        .status(400)
        .json({ message: "Signup allowed only with approved college email" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      college
    });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await OtpToken.deleteMany({ email: email.toLowerCase() });
    await OtpToken.create({ email: email.toLowerCase(), otp, expiresAt });

    await sendEmail({
      to: email,
      subject: "Verify your college email",
      html: signupOtpTemplate(otp)
    });

    res.status(201).json({ message: "Signup successful, OTP sent to email" });
  } catch (err) {
    next(err);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const record = await OtpToken.findOne({ email: email.toLowerCase(), otp });
    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();
    await OtpToken.deleteMany({ email: email.toLowerCase() });

    const accessToken = generateAccessToken({
      id: user._id,
      role: user.role,
      college: user.college
    });
    const refreshToken = generateRefreshToken({
      id: user._id,
      role: user.role,
      college: user.college
    });

    setAuthCookies(res, accessToken, refreshToken);

    res.json({
      message: "Email verified",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        averageRating: user.averageRating
      },
      accessToken,
      refreshToken
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Email not verified" });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: "User is banned" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken({
      id: user._id,
      role: user.role,
      college: user.college
    });
    const refreshToken = generateRefreshToken({
      id: user._id,
      role: user.role,
      college: user.college
    });

    setAuthCookies(res, accessToken, refreshToken);

    res.json({
      message: "Logged in",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        averageRating: user.averageRating
      },
      accessToken,
      refreshToken
    });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.refreshToken || req.body?.refreshToken || req.headers["x-refresh-token"];
    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = await new Promise((resolve, reject) => {
      import("jsonwebtoken")
        .then(({ default: jwt }) => {
          jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, payload) => {
            if (err) reject(err);
            else resolve(payload);
          });
        })
        .catch(reject);
    });

    const user = await User.findById(decoded.id);
    if (!user || user.isBanned) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken({
      id: user._id,
      role: user.role,
      college: user.college
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000
    });

    res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await PasswordResetToken.deleteMany({ email: email.toLowerCase() });
    await PasswordResetToken.create({ email: email.toLowerCase(), otp, expiresAt });

    await sendEmail({
      to: email,
      subject: "Password reset code",
      html: passwordResetOtpTemplate(otp)
    });

    res.json({ message: "Reset code sent to email" });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const record = await PasswordResetToken.findOne({
      email: email.toLowerCase(),
      otp
    });
    if (!record) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
    await PasswordResetToken.deleteMany({ email: email.toLowerCase() });

    res.json({ message: "Password updated" });
  } catch (err) {
    next(err);
  }
};

