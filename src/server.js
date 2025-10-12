import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routers/auth.js";
import pino from "pino";
import pinoHttp from "pino-http";

import contactsRouter from "./routers/contacts.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export function setupServer() {
  const app = express();
  const logger = pino({ level: process.env.LOG_LEVEL || "info" });

  app.use(cors());

  // 🟢 ПАРСЕРИ повинні бути ДО роутерів:
  app.use(express.json());
  app.use(cookieParser());

  app.use(pinoHttp({ logger }));

  // 🟢 Лише потім роутери:
  app.use("/auth", authRouter);
  app.use("/contacts", contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));

  return app;
}
