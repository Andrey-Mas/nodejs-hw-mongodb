import "dotenv/config";
import { initMongoConnection } from "./db/initMongoConnection.js";
import { setupServer } from "./server.js";

async function main() {
  await initMongoConnection(); // гарантуємо конект до БД перед стартом сервера
  setupServer();
}

main().catch((err) => {
  // останній шанс зловити фатальну помилку
  // eslint-disable-next-line no-console
  console.error("Fatal error on startup:", err);
  process.exit(1);
});
