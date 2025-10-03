import mongoose from "mongoose";

export async function initMongoConnection() {
  const uri = (process.env.MONGODB_URI || "").trim();
  if (!uri) throw new Error("MONGODB_URI is not set");

  // Тимчасові діагностичні логи (без пароля)
  console.log("URI prefix:", uri.slice(0, 14)); // очікуємо "mongodb+srv://"

  await mongoose.connect(uri);
  console.log("Mongo connection successfully established!");
}
