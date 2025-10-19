import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
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

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use("/auth", authRouter);
  app.use("/contacts", contactsRouter);
  // 🟢 ПАРСЕРИ повинні бути ДО роутерів:
  app.use(express.json());
  app.use(cookieParser());

  app.use(pinoHttp({ logger }));

  // 🟢 Лише потім роутери:
  app.use("/auth", authRouter);
  app.use("/contacts", contactsRouter);

  const swaggerJsonPath = path.resolve(process.cwd(), "docs", "swagger.json");
  let swaggerDocument = {};
  try {
    if (fs.existsSync(swaggerJsonPath)) {
      swaggerDocument = JSON.parse(fs.readFileSync(swaggerJsonPath, "utf-8"));
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(
      "Swagger JSON not found or invalid. Run `npm run build-docs` to generate docs."
    );
  }
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument || {}));

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));

  return app;
}
