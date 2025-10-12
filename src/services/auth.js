import bcrypt from "bcrypt";
import createError from "http-errors";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

const ACCESS_TTL_MS = 15 * 60 * 1000; // 15 minutes
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function registerUserService({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) throw createError(409, "Email in use");
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
}

export async function loginUserService({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw createError(401, "Email or password is wrong");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createError(401, "Email or password is wrong");

  await Session.deleteMany({ userId: user._id });

  const accessToken = signAccessToken({ sub: String(user._id) }, "15m");
  const refreshToken = signRefreshToken({ sub: String(user._id) }, "30d");

  const now = Date.now();
  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(now + ACCESS_TTL_MS),
    refreshTokenValidUntil: new Date(now + REFRESH_TTL_MS),
  });

  return { accessToken, sessionId: String(session._id), userId: String(user._id), refreshToken };
}

export async function refreshSessionService({ refreshToken }) {
  if (!refreshToken) throw createError(401, "No refresh token provided");

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw createError(401, "Invalid refresh token");
  }

  const session = await Session.findOne({ refreshToken });
  if (!session) throw createError(401, "Session not found");

  await Session.deleteOne({ _id: session._id });

  const userId = payload.sub;
  const accessToken = signAccessToken({ sub: String(userId) }, "15m");
  const newRefreshToken = signRefreshToken({ sub: String(userId) }, "30d");

  const now = Date.now();
  const newSession = await Session.create({
    userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(now + ACCESS_TTL_MS),
    refreshTokenValidUntil: new Date(now + REFRESH_TTL_MS),
  });

  return { accessToken, refreshToken: newRefreshToken, sessionId: String(newSession._id) };
}

export async function logoutService({ sessionId, refreshToken }) {
  if (!refreshToken) throw createError(401, "No refresh token provided");
  const filter = {};
  if (sessionId) filter._id = sessionId;
  filter.refreshToken = refreshToken;

  const res = await Session.findOneAndDelete(filter);
  if (!res) throw createError(401, "Session not found");
  return true;
}
