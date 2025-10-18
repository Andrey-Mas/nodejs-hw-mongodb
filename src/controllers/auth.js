import {
  registerUserService,
  loginUserService,
  refreshSessionService,
  logoutService,
} from "../services/auth.js";

export async function registerController(req, res) {
  const user = await registerUserService(req.body);
  res.status(201).json({
    status: 201,
    message: "Successfully registered a user!",
    data: user,
  });
}

export async function loginController(req, res) {
  const { accessToken, sessionId, refreshToken } = await loginUserService(req.body);

  const isProd = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: "Successfully logged in an user!",
    data: { accessToken },
  });
}

export async function refreshController(req, res) {
  const refreshToken = req.cookies?.refreshToken;
  const { accessToken, refreshToken: newRefresh, sessionId } = await refreshSessionService({ refreshToken });

  const isProd = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", newRefresh, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: "Successfully refreshed a session!",
    data: { accessToken },
  });
}

export async function logoutController(req, res) {
  const sessionId = req.cookies?.sessionId;
  const refreshToken = req.cookies?.refreshToken;
  await logoutService({ sessionId, refreshToken });
  res.clearCookie("refreshToken");
  res.clearCookie("sessionId");
  res.status(204).send();
}


import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import createError from "http-errors";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import { sendResetPasswordEmail } from "../services/email.js";

const RESET_SECRET = process.env.JWT_SECRET;

export async function sendResetEmailController(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw createError(404, "User not found!");
  if (!RESET_SECRET) throw createError(500, "Server misconfigured: JWT_SECRET missing");
  const token = jwt.sign({ email }, RESET_SECRET, { expiresIn: "5m" });
  await sendResetPasswordEmail({ to: email, token });
  res.status(200).json({
    status: 200,
    message: "Reset password email has been successfully sent.",
    data: {},
  });
}

export async function resetPasswordController(req, res) {
  const { token, password } = req.body;
  if (!RESET_SECRET) throw createError(500, "Server misconfigured: JWT_SECRET missing");
  try {
    const payload = jwt.verify(token, RESET_SECRET);
    const user = await User.findOne({ email: payload.email });
    if (!user) throw createError(404, "User not found!");
    const hash = await bcrypt.hash(password, 10);
    await User.updateOne({ _id: user._id }, { $set: { password: hash } });
    await Session.deleteMany({ userId: user._id });
    res.status(200).json({
      status: 200,
      message: "Password has been successfully reset.",
      data: {},
    });
  } catch (e) {
    if (e.name === "TokenExpiredError" || e.name === "JsonWebTokenError") {
      throw createError(401, "Token is expired or invalid.");
    }
    throw e;
  }
}
