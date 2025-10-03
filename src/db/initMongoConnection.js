import mongoose from "mongoose";

export async function initMongoConnection() {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
    process.env;

  const uri = `mongodb+srv://${encodeURIComponent(MONGODB_USER)}:${encodeURIComponent(
    MONGODB_PASSWORD
  )}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority&appName=render`;

  try {
    await mongoose.connect(uri);
    // eslint-disable-next-line no-console
    console.log("Mongo connection successfully established!");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Mongo connection error:", err.message);
    throw err;
  }
}
