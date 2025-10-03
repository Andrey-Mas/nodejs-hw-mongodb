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
  app.use(
    pinoHttp({
      logger,
      autoLogging: true,
    })
  );

  // РОУТИ
  app.get("/contacts", getContactsController);
  app.get("/contacts/:contactId", getContactByIdController);

  // 404 для неіснуючих маршрутів
  app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
  });

  // запуск сервера
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });

  return app;
}
// 404 для неіснуючих маршрутів
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Глобальний обробник помилок
app.use((err, req, res, next) => {
  // Лог у pino, якщо є
  req.log?.error(err);

  // Якщо це CastError (невірний ObjectId) — віддаємо як “не знайдено”
  if (err?.name === "CastError") {
    return res.status(404).json({ message: "Contact not found" });
  }

  return res.status(500).json({ message: "Internal Server Error" });
});
