import jwt from "jsonwebtoken";
import createError from "http-errors";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export function signAccessToken(payload, expiresIn = "15m") {
  if (!ACCESS_SECRET) throw createError(500, "Server misconfigured: JWT_ACCESS_SECRET missing");
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn });
}

export function signRefreshToken(payload, expiresIn = "30d") {
  if (!REFRESH_SECRET) throw createError(500, "Server misconfigured: JWT_REFRESH_SECRET missing");
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn });
}

export function verifyAccessToken(token) {
  if (!ACCESS_SECRET) throw createError(500, "Server misconfigured: JWT_ACCESS_SECRET missing");
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  if (!REFRESH_SECRET) throw createError(500, "Server misconfigured: JWT_REFRESH_SECRET missing");
  return jwt.verify(token, REFRESH_SECRET);
}
