import createError from "http-errors";
import { verifyAccessToken } from "../utils/jwt.js";
import { Session } from "../models/session.js";

export async function authenticate(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const [type, token] = auth.split(" ");
    if (type !== "Bearer" || !token) throw createError(401, "Unauthorized");

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (e) {
      if (e.name === "TokenExpiredError") {
        return next(createError(401, "Access token expired"));
      }
      return next(createError(401, "Unauthorized"));
    }

    const session = await Session.findOne({ userId: payload.sub, accessToken: token });
    if (!session) throw createError(401, "Unauthorized");

    req.user = { _id: payload.sub };
    next();
  } catch (err) {
    next(err);
  }
}
