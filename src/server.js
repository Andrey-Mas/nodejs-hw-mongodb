import express from "express";
import cors from "cors";
import pino from "pino";
import pinoHttp from "pino-http";

import contactsRouter from "./routers/contacts.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export function setupServer() {
  const app = express();

  const logger = pino({ level: process.env.LOG_LEVEL || "info" });

  app.use(cors());
  app.use(express.json());
  app.use(
    pinoHttp({
      logger,
      autoLogging: true,
    })
  );

  // Routes
  app.use("/contacts", contactsRouter);

  // 404 handler for unknown routes
  app.use(notFoundHandler);

  // Centralized error handler
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });

  return app;
}
