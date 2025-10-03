import "dotenv/config";
import { initMongoConnection } from "./db/initMongoConnection.js";
import { setupServer } from "./server.js";

async function main() {
  await initMongoConnection(); // важливо: конект до БД до старту сервера
  setupServer();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Fatal error on startup:", err);
  process.exit(1);
});
