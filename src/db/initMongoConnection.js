import mongoose from "mongoose";

export async function initMongoConnection() {
  const {
    MONGODB_URI,
    MONGODB_DB,
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_URL,
  } = process.env;

  let uri;
  let options = {};

  if (MONGODB_URI) {
    uri = MONGODB_URI;
    if (MONGODB_DB) options.dbName = MONGODB_DB;
  } else {
    if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_URL || !MONGODB_DB) {
      throw new Error(
        "Set MONGODB_URI or all of MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB"
      );
    }
    uri = `mongodb+srv://${encodeURIComponent(MONGODB_USER)}:${encodeURIComponent(
      MONGODB_PASSWORD
    )}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;
  }

  await mongoose.connect(uri, options);
  console.log("Mongo connection successfully established!");
}
