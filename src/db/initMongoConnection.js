import mongoose from "mongoose";

export async function initMongoConnection() {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
    process.env;

  if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_URL || !MONGODB_DB) {
    throw new Error(
      "Missing Mongo env vars. Required: MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB"
    );
  }

  const uri = `mongodb+srv://${encodeURIComponent(MONGODB_USER)}:${encodeURIComponent(
    MONGODB_PASSWORD
  )}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

  await mongoose.connect(uri);
  // eslint-disable-next-line no-console
  console.log("Mongo connection successfully established!");
}
