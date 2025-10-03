import express from "express";
import cors from "cors";
import pino from "pino";
import pinoHttp from "pino-http";
import {
  getContactsController,
  getContactByIdController,
} from "./controllers/contacts.js";

export function setupServer() {
  const app = express();

  // базові мідлвари
  app.use(cors());
  app.use(express.json());

  // pino-логер
  const logger = pino({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
  });
  app.use(pinoHttp({ logger, autoLogging: true }));

  // роутинг
  app.get("/contacts", getContactsController);
  app.get("/contacts/:contactId", getContactByIdController);

  // 404 для неіснуючих маршрутів
  app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
  });

  // глобальний обробник помилок (НА САМОМУ КІНЦІ)
  app.use((err, req, res, next) => {
    req.log?.error(err);
    // невалідний ObjectId → як "не знайдено"
    if (err?.name === "CastError") {
      return res.status(404).json({ message: "Contact not found" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });

  return app;
}
