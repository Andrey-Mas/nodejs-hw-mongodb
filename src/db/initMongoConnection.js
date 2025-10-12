import mongoose from "mongoose";

export async function initMongoConnection() {
  // 1) Спершу беремо готовий URI з .env
  let uri = process.env.MONGODB_URI;

  // 2) Якщо його немає — зліплюємо з окремих змінних (із URL-екодуванням!)
  if (!uri) {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
      process.env;
    if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_URL || !MONGODB_DB) {
      throw new Error(
        "Missing Mongo env vars. Provide MONGODB_URI or (MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB)"
      );
    }
    const user = encodeURIComponent(MONGODB_USER);
    const pass = encodeURIComponent(MONGODB_PASSWORD);
    uri = `mongodb+srv://${user}:${pass}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;
  }

  await mongoose.connect(uri);
  // eslint-disable-next-line no-console
  console.log("MongoDB connected");
}
