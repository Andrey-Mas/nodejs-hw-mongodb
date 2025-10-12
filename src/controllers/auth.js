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
